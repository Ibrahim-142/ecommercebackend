const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { addToCart,removeFromCart,getCart,clearCart } = require('../controllers/cartController');
router.post('/addtocart',authMiddleware,addToCart);
router.post('/removefromcart',authMiddleware,removeFromCart)
router.post('/clearcart',authMiddleware,clearCart)
router.get('/',authMiddleware,getCart);

module.exports = router;