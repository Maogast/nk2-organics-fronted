// utils/email.js
const nodemailer = require('nodemailer');

// Configure the transporter (here using Gmail as an example; adjust as needed)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

const sendOrderNotification = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Set your admin email here
    subject: 'New Order Received!',
    html: `
      <h3>New Order Details</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Customer Name:</strong> ${order.customerName}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Total Price:</strong> Ksh ${order.totalPrice.toFixed(2)}</p>
      <p>Please review the order in the admin dashboard.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent.');
  } catch (err) {
    console.error('Error sending order notification email:', err);
  }
};

module.exports = sendOrderNotification;