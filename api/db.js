// api/db.js
const mongoose = require('mongoose');

let connectionPromise = null; // Cache the connection promise

async function connectToDatabase() {
  // If there's already a connection attempt (or an established connection), return it.
  if (connectionPromise) {
    console.log('Using existing MongoDB connection');
    return connectionPromise;
  }

  // Otherwise, start a new connection attempt.
  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(db => {
      console.log('New MongoDB connection established');
      return db;
    })
    .catch(error => {
      console.error('MongoDB connection error:', error);
      // Reset the promise so that the next call tries to reconnect.
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

module.exports = connectToDatabase;