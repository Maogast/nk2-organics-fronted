// utils/email.js
const nodemailer = require('nodemailer');

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
  console.error(
    "Missing required environment variables: EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL"
  );
  // Optionally, you can exit the process here if variables are mandatory
  // process.exit(1);
}

// Configure the transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.EMAIL_PASS, // your email app password (if using 2FA) or Gmail password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

const sendOrderNotification = async (order) => {
  // Use fallbacks in case order properties differ
  const orderId = order._id || order.id || 'N/A';
  const customerName = order.customerName || order.customer_name || 'N/A';
  const customerEmail = order.email || order.customer_email || 'N/A';
  const address = order.address || order.customer_address || 'N/A';
  const totalPrice =
    order.totalPrice
      ? order.totalPrice.toFixed(2)
      : order.total
      ? Number(order.total).toFixed(2)
      : '0.00';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Order Received!',
    html: `
      <h3>New Order Details</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Total Price:</strong> Ksh ${totalPrice}</p>
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