import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createQuiz, deleteMyQuiz, getMyQuiz, getQuizById, updateQuiz } from "../controllers/quiz.js";

const router = express.Router();

router.post("/new", isAuthenticated, createQuiz);
router.get("/myQuiz", isAuthenticated, getMyQuiz);
router.delete("/:id", isAuthenticated, deleteMyQuiz);
router.patch("/quizzes/:id", updateQuiz);
router.get("/getQuiz/:id", getQuizById)

export default router;
