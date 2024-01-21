import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "JobListing",
    })
    .then((c) => console.log("Database connected"))
    .catch((error) => console.error("Database connection error:", error));
};
