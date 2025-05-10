// api/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import the cached database connection helper
const connectToDatabase = require('./db');

// Import models and routers
const Product = require('../models/Product');
const ordersRouter = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware: Ensure DB connection is established before each request.
app.use(async (req, res, next) => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable not defined!");
    return res.status(500).json({ error: 'Database connection URI not provided.' });
  }

  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Error connecting to database:', err);
    return res.status(500).json({ error: 'Database connection failed.' });
  }
});

// Basic test route.
app.get('/', (req, res) => {
  res.send('NK-Organics Backend is Running');
});

// GET endpoint for fetching products (used for manual updates; note: your frontend now loads products statically)
app.get('/products', async (req, res) => {
  try {
    // Fetch up to 100 products using lean() for performance.
    const products = await Product.find({}).lean().limit(100);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST endpoint for adding a new product (for manual updates)
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