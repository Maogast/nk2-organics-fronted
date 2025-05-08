// api/app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your models and utilities
const Product = require('../models/Product');
const Order = require('../models/Order'); // Ensure models/Order.js exists
const sendOrderNotification = require('../utils/email'); // Email notification module

const app = express();
const MONGO_URI = process.env.MONGO_URI;

// Allowed admin emails (you can also load these from environment variables)
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "stevecr58@gmail.com",
  "admin3@example.com"
];

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  // Expect the admin email to be passed in a custom header, for example: x-admin-email
  const adminEmail = req.headers['x-admin-email'];
  if (!adminEmail) {
    return res.status(401).json({ error: 'Admin email header missing.' });
  }
  if (!allowedAdminEmails.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Access denied. Unauthorized admin.' });
  }
  next();
};

// Set up middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (this runs once per cold start of the serverless function)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('NK-Organics Backend is Running');
});

// GET endpoint for fetching all products from the catalog
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST endpoint for adding a new product (for manual updates by uploading JSON data)
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

// GET endpoint for fetching all orders (Admin Dashboard) (Protected by adminAuth middleware)
app.get('/api/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// POST endpoint for receiving orders from the frontend
app.post('/api/orders', async (req, res) => {
  try {
    const { orderInfo, items, total } = req.body;
    const newOrder = new Order({
      customerName: orderInfo.name,
      email: orderInfo.email,
      address: orderInfo.address,
      items: items, // items should include product name, price, and quantity ordered
      totalPrice: total,
    });
    const savedOrder = await newOrder.save();

    // Send an email notification to the admin about the new order.
    sendOrderNotification(savedOrder);

    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('Order submission error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT endpoint for updating order status (Protected by adminAuth middleware)
app.put('/api/orders/:orderId', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE endpoint for deleting an order (Protected by adminAuth middleware)
app.delete('/api/orders/:orderId', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: 'Failed to delete order.' });
  }
});

module.exports = app;