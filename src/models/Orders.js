const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      
      required: true,  
    },
    cart: [
      {
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      }
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    totalAmount: Number,
    shippingCost: Number,
    shippingType: String,
    status: { type: String, default: "Processing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);