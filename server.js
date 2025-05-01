const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Untuk akses file statis

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/Maha_parfum', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Skema dan Model
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

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// === API Routes ===

// Produk
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Keranjang (Cart)
app.get('/api/cart', async (req, res) => {
    try {
        const items = await Cart.find().populate('productId');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// Hapus satu item di cart
app.delete('/api/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.findByIdAndDelete(id);
        res.json({ message: 'Item berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kosongkan semua item cart (checkout)
app.delete('/api/cart/clear', async (req, res) => {
    try {
        await Cart.deleteMany({});
        res.json({ message: 'Cart dikosongkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });
  
