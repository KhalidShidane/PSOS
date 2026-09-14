import mongoose from "mongoose";

/**
 * Connects to MongoDB using MONGODB_URI from the environment.
 * Kept separate from server.js so database concerns stay isolated
 * from HTTP server concerns.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env file before starting the server."
    );
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
