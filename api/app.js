// api/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models and utilities
const Product = require('../models/Product');
// We'll use sendOrderNotification if needed in the orders router.
// const sendOrderNotification = require('../utils/email');

// Import the orders router.
const ordersRouter = require('./routes/orders');

const app = express();
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB.
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic test route.
app.get('/', (req, res) => {
  res.send('NK-Organics Backend is Running');
});

// GET endpoint for fetching all products from the catalog.
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST endpoint for adding a new product (for manual updates by uploading JSON data).
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product.' });
  }
});

// Mount the orders router at /api/orders.
// The router itself protects sensitive operations via adminAuth.
app.use('/api/orders', ordersRouter);

module.exports = app;