const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // untuk akses html, js, css, assets

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/Maha_parfum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Skema dan Model Produk
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

const cartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  

const Product = mongoose.model('Product', productSchema);

// API: ambil semua produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: input produk baru
app.post('/api/products', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // API: tambah ke keranjang
app.post('/api/cart', async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cartItem = new Cart({ productId, quantity });
      await cartItem.save();
      res.status(201).json(cartItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // API: ambil semua item di keranjang
  app.get('/api/cart', async (req, res) => {
    try {
      const items = await Cart.find().populate('productId');
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
