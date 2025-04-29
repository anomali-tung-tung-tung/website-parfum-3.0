const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Maha_parfum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

const data = [
  {
    name: ' alfatos',
    price: 75000,
    image: './asssets/parfum1.jpg',
    description: 'Aroma mawar segar dan tahan lama',
  },
  {
    name: 'pragos',
    price: 85000,
    image: './asssets/parfum2.jpg',
    description: 'Wangi manis dan lembut khas vanilla',
  },
  {
    name: 'santanos',
    price: 92000,
    image: './asssets/parfum3.jpg',
    description: 'Segar dan menyegarkan seperti jeruk',
  },

  {
    name: 'hibbos',
    price: 92000,
    image: './asssets/parfum3.jpg',
    description: 'Segar dan menyegarkan seperti jeruk',
  }
];

Product.insertMany(data)
  .then(() => {
    console.log('Data berhasil dimasukkan!');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
