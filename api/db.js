const mongoose = require('mongoose');

let isConnected = false; // Cached connection flag

async function connectToDatabase() {
  // If already connected, reuse existing connection.
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Mark connection as established.
    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log('New MongoDB connection established');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectToDatabase;