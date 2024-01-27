import express from "express";
import { config } from "dotenv";
import { connectDB } from "./data/database.js";
import userRouter from "./routes/user.js";
import quizRouter from "./routes/quiz.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

//CONFIGURATION
config({
  path: "./data/.env",
});

//MONGOOSE SETUP
connectDB();

//USING MIDDLEWARE
export const app = express();
app.use(express.json());
console.log(process.env.FRONTEND_URI);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: [process.env.FRONTEND_URI],
  // origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],

}));


//HEALTH API
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    message: "Server is healthy and running",
  });
});


//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/quiz", quizRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  try {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  } catch (error) {
    console.log('app.use error: ', error);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
});
