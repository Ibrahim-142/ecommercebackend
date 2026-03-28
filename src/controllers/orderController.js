const Order = require("../models/Orders");
const mongoose = require("mongoose");
const placeOrder = async (req, res) => {
  try {
    const { cart, shippingAddress, totalAmount, shippingCost, shippingType } = req.body;

    if (!cart || !shippingAddress || !totalAmount || shippingCost == null || !shippingType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
      user: req.user.id,  
      cart,
      shippingAddress,
      totalAmount,
      shippingCost,
      shippingType
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Error Placing Order" });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Error getting user orders" });
  }
};
const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting order by id" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,   
  getOrderById,
};