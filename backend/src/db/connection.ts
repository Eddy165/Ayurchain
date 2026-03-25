import mongoose from "mongoose";
import { config } from "../config";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Local MongoDB connection failed. Falling back to mongodb-memory-server...");
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-memory MongoDB connected successfully at ${mongoUri}`);
    } catch (fallbackErr) {
      console.error("MongoDB in-memory fallback error:", fallbackErr);
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error);
});
