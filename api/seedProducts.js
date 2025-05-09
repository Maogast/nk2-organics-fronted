// api/seedProducts.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load .env from project root
console.log('Working directory:', process.cwd());
console.log('MONGO_URI:', process.env.MONGO_URI);  // Debug: Check if value is loaded

const mongoose = require('mongoose');
const Product = require('../models/Product');  // Ensure the path is correct
const products = require('./data/products.json');  // Path to your JSON file

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    for (const p of products) {
      await Product.updateOne(
        { name: p.name },   // Adjust unique key if needed
        {
          $set: {
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
            category: p.category,
          },
        },
        { upsert: true }
      );
    }
    console.log('Products seeded/updated successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding products:', err);
    process.exit(1);
  });