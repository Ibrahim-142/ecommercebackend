const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { placeOrder, getUserOrders,getOrderById } = require('../controllers/orderController');
router.post('/placeorder', authMiddleware,placeOrder);
router.get('/', authMiddleware,getUserOrders);
router.get("/:id",authMiddleware,getOrderById);
module.exports = router;