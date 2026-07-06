import mongoose from "mongoose";

let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 3;

const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("FATAL: MONGODB_URI is not defined in environment variables.");
    return;
  }

  // Reset flag if connection dropped
  if (mongoose.connection.readyState === 0) {
    isConnected = false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    isConnected = conn.connections[0].readyState === 1;
    retryCount = 0;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Reset flag on disconnect so next request triggers reconnect
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Will reconnect on next request.");
      isConnected = false;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
      isConnected = false;
    });
  } catch (error: any) {
    isConnected = false;
    retryCount++;
    console.error(`❌ MongoDB Connection Error (attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      const delay = retryCount * 1000;
      console.log(`🔄 Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB();
    } else {
      console.error("❌ Max retries reached. Could not connect to MongoDB.");
      retryCount = 0; // reset for next invocation in serverless
    }
  }
};

export default connectDB;
