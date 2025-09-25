import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  console.log("MongoDB URI===>", process.env.MONGODB_URI);
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("DB connected successfully.");
  } catch (error: any) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;