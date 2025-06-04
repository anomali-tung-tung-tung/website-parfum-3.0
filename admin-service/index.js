require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/Order');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => console.log("Admin DB connected"));

app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Admin Service running on ${PORT}`));