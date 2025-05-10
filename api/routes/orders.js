// routes/orders.js

const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const sendOrderNotification = require('../../utils/email'); // Ensure this returns a promise if asynchronous

// Inline Admin Authentication Middleware for orders.
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "stevecr58@gmail.com",
  "sacalivinmocha@gmail.com"
];
const adminAuth = (req, res, next) => {
  const adminEmail = req.headers['x-admin-email'];
  if (!adminEmail) {
    return res.status(401).json({ error: 'Admin email header missing.' });
  }
  if (!allowedAdminEmails.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Access denied. Unauthorized admin.' });
  }
  next();
};

// POST endpoint to create a new order. (Open for customers.)
router.post('/', async (req, res) => {
  try {
    const { orderInfo, items, total, transactionId } = req.body;
    const newOrder = new Order({
      customerName: orderInfo.name,
      email: orderInfo.email,
      address: orderInfo.address,
      items: items,  // Array of grouped items.
      totalPrice: total,
      transactionId: transactionId || "",  // Store transaction ID if provided.
    });
    await newOrder.save();

    // Fire-and-forget: send the order notification asynchronously.
    // Temporarily disable email notification to see if it speeds up the endpoint.
    //setTimeout(() => {
     // sendOrderNotification(newOrder).catch((err) => {
      //  console.error("Error sending order notification:", err);
    //  });
   // }, 0);

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order submission error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET endpoint to fetch all orders (protected) using .lean() for performance.
// Added .limit(50) to restrict the result set.
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().lean().sort({ createdAt: -1 }).limit(50);
    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

router.put('/:orderId', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
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
    console.error("Error updating order status:", err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.put('/:orderId/confirm-payment', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'confirmed' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Error confirming payment:", err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

router.delete('/:orderId', adminAuth, async (req, res) => {
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

module.exports = router;