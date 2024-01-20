import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createQuiz, deleteMyQuiz, getMyQuiz } from "../controllers/quiz.js";

const router = express.Router();

router.post("/new", isAuthenticated, createQuiz);
router.get("/myQuiz", isAuthenticated, getMyQuiz);
router.delete("/:id", isAuthenticated, deleteMyQuiz);

export default router;
