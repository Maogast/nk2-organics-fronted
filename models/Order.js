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
  // New fields for capturing payment details:
  transactionId: { type: String, default: "" }, // Stores the Mpesa transaction ID (e.g., TE82UXIK7O)
  paymentStatus: {
    // Tracks the payment's confirmation state.
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending',
  },
  status: { type: String, default: 'pending' }, // Order processing status.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);