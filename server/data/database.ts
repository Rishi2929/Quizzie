import mongoose from "mongoose";
import { config } from "dotenv";

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoURI, {
      dbName: "Quizzie",
      autoIndex: true,
    });

    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
