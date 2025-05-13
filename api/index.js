// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Import your API handlers.
const customerOrdersHandler = require('./customerOrders').default;
const ordersHandler = require('./orders').default;
const analyticsHandler = require('./analytics').default;
const subscribeHandler = require('./subscribe').default;

// Endpoint for customer orders (for general customers)
app.get('/api/customerOrders', (req, res) => {
  customerOrdersHandler(req, res);
});

// Endpoint for orders (for admin features: viewing, updating, confirming payment, deleting)
// This routes any HTTP method with a URL starting with "/api/orders" to your orders.js handler.
app.all('/api/orders*', (req, res) => {
  ordersHandler(req, res);
});

// Analytics endpoint to retrieve aggregated sales/orders data for admin dashboards.
app.get('/api/analytics', (req, res) => {
  analyticsHandler(req, res);
});

// Newsletter subscription endpoint to store subscriber emails.
app.post('/api/subscribe', (req, res) => {
  subscribeHandler(req, res);
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});