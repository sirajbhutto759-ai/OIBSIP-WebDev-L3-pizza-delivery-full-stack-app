const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizzahub';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    // If localhost failed, try 127.0.0.1 explicitly
    if (uri.includes('localhost')) {
      try {
        const fallbackUri = uri.replace('localhost', '127.0.0.1');
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected (via 127.0.0.1): ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`❌ Fallback MongoDB Connection Error: ${fallbackError.message}`);
      }
    }
    throw error;
  }
};

module.exports = connectDB;
