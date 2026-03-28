const express = require("express");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const app = express();
// Allow all origins (development only)
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));
// Or, allow only your frontend
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
const authRoutes=require('./routes/authRoutes')
app.use('/api/auth',authRoutes)
const chabotRoutes=require('./routes/chatbotRoutes')
app.use('/api/chatbot',chabotRoutes)
module.exports = app;