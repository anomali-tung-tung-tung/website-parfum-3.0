const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Adjust according to your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/maha_parfum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Database Schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Using string for simplicity, can be ObjectId if you have User model
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    priceAtPurchase: Number
  }],
  total: Number,
  paymentStatus: { type: String, default: 'pending' },
  shippingAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);

// === API Routes ===

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a product (Admin only)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cart Routes

// Add item to cart
app.post('/api/cart/:userId/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Validate stock
    if (quantity > product.stock) {
      return res.status(400).json({ error: 'Quantity exceeds available stock' });
    }
    
    let cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        user: req.params.userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        cart.items.push({ product: productId, quantity });
      }
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(201).json(populatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Checkout Routes
app.post('/api/cart/:userId/checkout', async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.params.userId;
    
    // Get cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Ensure no duplicates in cart
    const uniqueItems = [];
    cart.items.forEach(item => {
      const existingItem = uniqueItems.find(i => i.product.toString() === item.product._id.toString());
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        uniqueItems.push(item);
      }
    });

    cart.items = uniqueItems;
    await cart.save();

    // Check stock and update
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.product.price
    }));
    
    const total = cart.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0);
    
    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      paymentStatus: 'completed',
      shippingAddress
    });
    await order.save();
    
    // Clear cart after checkout
    await Cart.deleteOne({ _id: cart._id });
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Dashboard - View All Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
