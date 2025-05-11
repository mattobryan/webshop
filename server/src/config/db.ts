// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string;
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit on DB connection failure
  }
};

export default connectDB;
