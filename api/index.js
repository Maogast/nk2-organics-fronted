// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Import your customerOrders handler.
// If using CommonJS, you may need to adjust this import depending on how your module is exported.
const customerOrdersHandler = require('./customerOrders').default;

// Route GET requests to /api/customerOrders to your handler.
app.get('/api/customerOrders', (req, res) => {
  customerOrdersHandler(req, res);
});

// Start the API server.
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});