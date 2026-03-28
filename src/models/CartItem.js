const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
{
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  count: {
    type: Number,
    default: 1
  },
},
{
  timestamps: true
}
);

module.exports = mongoose.model("CartItem", cartItemSchema);