import { registerAs } from '@nestjs/config';
import mongoose from 'mongoose';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'mongodb://localhost:27017/nail-studio',
}));

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/nail-studio');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}; 