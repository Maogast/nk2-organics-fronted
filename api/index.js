// api/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Rate limiting middleware.
const rateLimit = require('express-rate-limit');
const ordersLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // limit each IP to 100 requests per minute
});

// Caching middleware using node-cache.
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // Cache items for 60 seconds

// Middleware to parse JSON bodies.
app.use(express.json());
app.use(cors());

// Optional: Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Import API handlers.
const customerOrdersHandler = require('./customerOrders').default;
const ordersHandler = require('./orders').default;
const analyticsHandler = require('./analytics').default;
const subscribeHandler = require('./subscribe').default;

// Caching for GET /api/orders.
app.get('/api/orders', ordersLimiter, async (req, res, next) => {
  // Create a unique cache key based on URL and query parameters.
  const cacheKey = `orders_${req.originalUrl}`;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log(`Returning cached orders for key: ${cacheKey}`);
    return res.status(200).json(cachedResponse);
  }
  // Override res.json to cache the response.
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(cacheKey, body);
    return originalJson(body);
  };
  next();
});

// Mount handlers.
app.get('/api/customerOrders', (req, res) => {
  customerOrdersHandler(req, res);
});

// For orders, we apply rate limiting and caching on GET, then use our handler for all subpaths.
app.use('/api/orders', ordersHandler);

// Analytics endpoint.
app.get('/api/analytics', (req, res) => {
  analyticsHandler(req, res);
});

// Newsletter subscription endpoint.
app.post('/api/subscribe', (req, res) => {
  subscribeHandler(req, res);
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});