const products = require("../data/products");

// 🧠 Simple memory (per server instance)
let userContext = {
  lastResults: [],
  lastQuery: ""
};

// 🛒 Mock cart storage (local array)
let cart = [];

const chatbotHandler = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const text = message.toLowerCase().trim();

  // =========================
  // 1. CHECK IF USER WANTS TO ADD TO CART
  // =========================
  const addToCartMatch = text.match(/add\s+(.+?)(?:\s+(\d+))?\s*(to cart)?$/);
  if (addToCartMatch) {
    let productName = addToCartMatch[1].trim();
    let quantity = parseInt(addToCartMatch[2]) || 1; // default to 1 if not specified

    // Find product in last search results (case-insensitive)
    const product = userContext.lastResults.find(
      p => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return res.json({
        success: false,
        message: `Could not find "${productName}" in your recent search results 😅`
      });
    }

    // Add to cart (or update quantity if already exists)
    const existingItemIndex = cart.findIndex(
      item => item.name.toLowerCase() === product.name.toLowerCase()
    );
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        name: product.name,
        price: product.price,
        quantity
      });
    }

    return res.json({
      success: true,
      message: `${quantity} x ${product.name} added to cart 🛒`,
      cart
    });
  }

  // =========================
  // 2. NORMAL PRODUCT SEARCH
  // =========================
  const queryWords = text.split(/\s+/);

  let results = products.map(p => {
    const productTags = p.tags.map(t => t.toLowerCase());
    const matchedTags = queryWords.filter(word => productTags.includes(word));
    const score = matchedTags.length;
    return { ...p, score, matchedTags };
  })
  .filter(p => p.score > 0)
  .sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return res.json({
      success: true,
      message: "Couldn't find any products matching your query 😅",
      data: [],
      suggestions: ["summer clothes", "cheap shoes", "gift items"]
    });
  }

  // Save context
  userContext.lastResults = results;
  userContext.lastQuery = text;

  // Smart suggestions
  const suggestions = [
    "Show summer options",
    "Show men items",
    "Gift ideas"
  ];

  // Prepare response
  const response = results.slice(0, 5).map(p => ({
    name: p.name,
    price: p.price,
    image: p.image,
    matchedTags: p.matchedTags
  }));

  res.json({
    success: true,
    message: "Here’s what I found based on your query 👇",
    data: response,
    suggestions
  });
};

module.exports = { chatbotHandler };