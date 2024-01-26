import express from "express";
import { config } from "dotenv";
import { connectDB } from "./data/database.js";
import userRouter from "./routes/user.js";
import quizRouter from "./routes/quiz.js";
import cookieParser from "cookie-parser";
import cors from 'cors';


export const app = express();

//CONFIGURATION
config({
  path: "./data/.env",
});

//USING MIDDLEWARE
app.use(express.json());
console.log(process.env.FRONTEND_URI);
app.use(cookieParser());
app.use(cors({
  // origin: [process.env.FRONTEND_URI],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  // credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
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

//MONGOOSE SETUP
connectDB();
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
});
