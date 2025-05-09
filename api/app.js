require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');

// Import the cached database connection helper
const connectToDatabase = require('./db');

// Import models and utilities
const Product = require('../models/Product');
// Uncomment if needed later:
// const sendOrderNotification = require('../utils/email');

// Import the orders router.
const ordersRouter = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

// Use a middleware to ensure the database connection is established before each request.
app.use(async (req, res, next) => {
  // Check if the required environment variable is defined.
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable not defined!");
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Database connection URI not provided.' });
    }
    return;
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Error connecting to database:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Database connection failed.' });
    }
    next(err);
  }
});

// Basic test route.
app.get('/', (req, res) => {
  res.send('NK-Organics Backend is Running');
});

// GET endpoint for fetching all products from the catalog.
app.get('/products', async (req, res) => {
  try {
    // Fetch up to 100 products using lean() for faster query execution.
    const products = await Product.find({}).lean().limit(100);
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
app.use('/api/orders', ordersRouter);

module.exports = app;