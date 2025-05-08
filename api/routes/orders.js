// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { orderInfo, items, total } = req.body;
    const newOrder = new Order({
      customerName: orderInfo.name,
      email: orderInfo.email,
      address: orderInfo.address,
      items: items,  // This should be your grouped items array
      totalPrice: total,
    });
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;