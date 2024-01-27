import mongoose from "mongoose";

// process.env.MONGO_URI

export const connectDB = () => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/', {
      dbName: "quizzie",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    })
    .then((c) => console.log("Database connected"))
    .catch((error) => console.log("Database connection error:", error));
};
