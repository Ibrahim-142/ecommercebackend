const Product = require('../models/Product');
const products = require('../data/products'); 
async function seedProducts(req, res) {
  try {
    const existing = await Product.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ message: 'Products already seeded' });
    }

    const inserted = await Product.insertMany(products);
    res.status(201).json({ insertedCount: inserted.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function getProducts(req, res) {
  try {
    const allProducts = await Product.find({});
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function deleteAllProducts(req, res) {
  try {
    await Product.deleteMany({});
    res.json({ message: 'All products deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { seedProducts, getProducts, deleteAllProducts};