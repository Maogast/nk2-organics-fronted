/*// models/Product.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/150' },
});

module.exports = mongoose.model('Product', ProductSchema);*/