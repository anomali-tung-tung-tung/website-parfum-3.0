const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/product'); // Path sesuai struktur project

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', productRoutes);

// MongoDB
mongoose.connect('mongodb://mongo:27017/parfumdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB (Product Service)');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
