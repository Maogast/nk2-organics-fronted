// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // NEW: Track the status of the order.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);