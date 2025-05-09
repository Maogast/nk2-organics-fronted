const serverless = require('serverless-http');
const app = require('./app');

// If running directly (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = serverless(app);