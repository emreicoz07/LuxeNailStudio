import { registerAs } from '@nestjs/config';
import mongoose from 'mongoose';

export default registerAs('database', () => ({
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/nail-studio',
}));

export const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: 'nail-studio',
    });
    
    console.log('Successfully connected to MongoDB Atlas nail-studio database');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
  }
}; 