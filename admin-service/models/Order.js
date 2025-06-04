const mongoose = require('mongoose');

module.exports = mongoose.model('Order', new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number
    }
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now }
}));
