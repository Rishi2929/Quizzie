import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./data/database.js";
import userRouter from "./routes/user.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

config({ path: ".env" });

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    message: "Server is healthy and running",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/quiz", quizRouter);

app.use(errorMiddleware);

const port = Number(process.env.PORT) || 3001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is working on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
