require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Cart = require('./models/Cart');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => console.log("Cart DB connected"));

app.get('/cart/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

app.post('/cart', async (req, res) => {
  const { userId, items } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items });
  } else {
    cart.items = items;
  }
  await cart.save();
  res.json(cart);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Cart Service running on ${PORT}`));