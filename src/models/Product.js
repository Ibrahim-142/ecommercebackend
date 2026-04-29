const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  longDescription: { type: String },
  price: { type: Number, required: true },
  bottomPrice: { type: Number },
  category: { type: String },
  subcategory: { type: String },
  tags: { type: [String] },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true
});

productSchema.index({
  name: "text",
  description: "text",
  longDescription: "text",
  category: "text",
  subcategory: "text",
  tags: "text"
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;