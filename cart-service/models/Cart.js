// cart-service/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Cart = require('./models/Cart');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => console.log("Cart DB connected"));

// Ambil isi keranjang user
app.get('/cart/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.json([]);
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah atau update item di keranjang (quantity bertambah/berkurang)
app.post('/cart', async (req, res) => {
  try {
    const { userId, productId, quantityChange } = req.body;
    if (!userId || !productId || typeof quantityChange !== 'number') {
      return res.status(400).json({ error: 'userId, productId and quantityChange are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);

    if (itemIndex === -1 && quantityChange > 0) {
      // item baru, tambah ke keranjang
      cart.items.push({ productId, quantity: quantityChange });
    } else if (itemIndex !== -1) {
      // update quantity
      cart.items[itemIndex].quantity += quantityChange;
      if (cart.items[itemIndex].quantity <= 0) {
        // hapus item jika quantity <= 0
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus item dari keranjang
app.delete('/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== productId);
    await cart.save();

    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Checkout keranjang (kosongkan)
app.post('/cart/checkout/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    // Di sini kamu bisa tambahkan logic checkout tambahan, misal simpan ke order collection, pembayaran, dll
    cart.items = [];
    await cart.save();

    res.json({ message: 'Checkout successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Cart Service running on ${PORT}`));
