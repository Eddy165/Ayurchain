import mongoose from "mongoose";

/**
 * @dev Connects to MongoDB with retry logic (max 5 retries)
 */
export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ayurchain";
  let retries = 5;
  
  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB Connected Successfully");
      break;
    } catch (error: any) {
      console.error(`MongoDB connection failed. Retries left: ${retries - 1}`);
      console.error("Error:", error.message);
      retries -= 1;
      
      if (retries === 0) {
        console.error("Exhausted all MongoDB connection retries. Exiting...");
        process.exit(1);
      }
      
      // Wait 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
