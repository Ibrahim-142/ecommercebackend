const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
async function addToCart(req, res) {
  try {
    const { product, count = 1 } = req.body;

    if (!product) {
      return res.status(400).json({ message: "Product ID required" });
    }
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingItem = await CartItem.findOne({ product, user: req.user.id });
    if (existingItem) {
      existingItem.count += count; 
      await existingItem.save();
      return res.json(existingItem);
    }
    const newItem = await CartItem.create({
      product,
      count,
      user: req.user.id,
    });

    res.status(201).json(newItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getCart(req, res) {
  try {
    const cart = await CartItem.find({ user: req.user.id })
      .populate(
        "product",
        "name price image rating reviewCount stockCount inStock longDescription"
      );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;

    const item = await CartItem.findOne({ product: productId, user: req.user.id });

    if (!item) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }

    item.count -= 1;

    if (item.count <= 0) {
      await item.deleteOne();
      return res.json({ message: "Item removed from cart" });
    }

    await item.save();
    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function clearCart(req, res) {
  try {
    await CartItem.deleteMany({ user: req.user.id });

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};