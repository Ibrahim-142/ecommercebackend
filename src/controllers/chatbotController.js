const Product = require("../models/Product");
const CartItem = require("../models/CartItem");

const chatbotHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const text = message.toLowerCase().trim();

    // =========================
    // 1. ADD TO CART
    // =========================
    const addToCartMatch = text.match(/add\s+(.+?)(?:\s+(\d+))?\s*(to cart)?$/);
    if (addToCartMatch) {
      const productName = addToCartMatch[1].trim();
      const quantity = parseInt(addToCartMatch[2]) || 1;

      // 🔎 DB lookup by name (case-insensitive)
      const product = await Product.findOne({
        name: { $regex: new RegExp(`^${productName}$`, "i") }
      });

      if (!product) {
        return res.json({
          success: false,
          message: `Product "${productName}" not found in database 😅`
        });
      }

      // Add or update in real cart
      let cartItem = await CartItem.findOne({ product: product._id, user: userId });
      if (cartItem) {
        cartItem.count += quantity;
        await cartItem.save();
      } else {
        cartItem = await CartItem.create({
          product: product._id,
          count: quantity,
          user: userId
        });
      }

      const populatedItem = await cartItem.populate("product", "name price image");

      return res.json({
        success: true,
        message: `${quantity} x ${populatedItem.product.name} added to cart 🛒`,
        cart: populatedItem
      });
    }
    // =========================
    // 2. PRODUCT SEARCH (optimized)
    // =========================
    const queryWords = text.split(/\s+/);

    // 🔥 ONLY FETCH PRODUCTS THAT HAVE TAGS (small optimization)
    const allProducts = await Product.find(
      { tags: { $exists: true, $ne: [] } },
      { name: 1, price: 1, image: 1, tags: 1 } // 🔥 projection (faster)
    );

    const results = allProducts
      .map(p => {
        const productTags = (p.tags || []).map(t => t.toLowerCase());

        let score = 0;

        for (let word of queryWords) {
          if (productTags.includes(word)) {
            score++;
          }
        }

        return {
          ...p.toObject(),
          score,
          matchedTags: queryWords.filter(w =>
            productTags.includes(w)
          )
        };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // 🔥 moved slice earlier (faster)

    if (results.length === 0) {
      return res.json({
        success: true,
        message: "Couldn't find any products matching your query 😅",
        data: [],
        suggestions: ["summer clothes", "cheap shoes", "gift items"]
      });
    }

    const response = results.map(p => ({
      name: p.name,
      price: p.price,
      image: p.image,
      matchedTags: p.matchedTags
    }));

    return res.json({
      success: true,
      message: "Here’s what I found based on your query 👇",
      data: response,
      suggestions: ["Show summer options", "Show men items", "Gift ideas"]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chatbotHandler };