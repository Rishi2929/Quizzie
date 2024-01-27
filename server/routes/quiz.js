import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createQuiz, deleteMyQuiz, getMyQuiz, updateQuiz } from "../controllers/quiz.js";

const router = express.Router();

router.post("/new", isAuthenticated, createQuiz);
router.get("/myQuiz", getMyQuiz);
router.delete("/:id", isAuthenticated, deleteMyQuiz);
router.patch("/quizzes/:id", updateQuiz);

export default router;
