import mongoose from 'mongoose';

async function dbConnect() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI not set in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw new Error('Connection failed');
    } else {
      console.error('unexpected error:', error);
    }
  }
}

export default dbConnect;
