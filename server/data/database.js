import mongoose from "mongoose";


export const connectDB = () => {
  mongoose
    // .connect(process.env.MONGO_URI
      .connect('mongodb://127.0.0.1:27017/'
      , {
        dbName: "quizzie",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
      })
    .then((c) => console.log("Database connected"))
    .catch((error) => console.log("Database connection error:", error));
};
