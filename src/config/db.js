import mongoose from "mongoose";
import { config } from "../../constants.js";
const connectDB = async () => {
  try {
    await mongoose.connect(config.uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
