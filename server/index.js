import express from "express";
import { config } from "dotenv";

export const app = express();
config({
  path: "./data/.env",
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    message: "Server is healthy and running",
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
});
