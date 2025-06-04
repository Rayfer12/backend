const mongoose = require('mongoose');

// MongoDB URI with the correct username, password, and database name
const mongoURI = 'mongodb://e2425-wads-l4bcg6:1iwiphe2@localhost:27018/e2425-wads-l4bcg6?authSource=e2425-wads-l4bcg6';

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);  // Exit the process if the connection fails
  }
};

module.exports = connectDB;
