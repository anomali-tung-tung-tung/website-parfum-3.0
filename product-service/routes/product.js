// routes/product.js (atau bisa langsung di server.js)
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Pastikan path-nya sesuai

// GET /products → Ambil semua produk
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// POST /products → Tambah produk baru (opsional, misal admin)
router.post('/products', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = new Product({ name, price, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Gagal menambah produk:', error);
    res.status(500).json({ error: 'Gagal menambah produk' });
  }
});

module.exports = router;
