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
  transactionId: { type: String, default: "" },
  paymentStatus: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending',
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Create an index on the createdAt field for efficient sorting.
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);