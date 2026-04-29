const express = require('express');
const router = express.Router();
const { seedProducts, getProducts,deleteAllProducts,searchProducts } = require('../controllers/productController');
router.post('/seed', seedProducts); 
router.get('/', getProducts);
router.get('/search',searchProducts);
// router.delete('/delete-all', deleteAllProducts);    

module.exports = router;