const express = require('express');
const router = express.Router();
const { seedProducts, getProducts,deleteAllProducts } = require('../controllers/productController');
router.post('/seed', seedProducts); 
router.get('/', getProducts);
// router.delete('/delete-all', deleteAllProducts);    

module.exports = router;