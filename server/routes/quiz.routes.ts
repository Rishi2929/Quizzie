import { Router } from "express";

import { isAuthenticated } from "../middleware/auth.middleware.js";

import {
  createQuiz,
  deleteMyQuiz,
  getMyQuiz,
  getQuizById,
  getQuizByIdForAnalytics,
  updateQuizById,
  updateQuizCount,
} from "../controllers/quiz.controller.js";

const router = Router();

router.post("/new", isAuthenticated, createQuiz);

router.get("/myQuiz", isAuthenticated, getMyQuiz);

router.delete("/:id", isAuthenticated, deleteMyQuiz);

router.put("/updateQuiz/:id", isAuthenticated, updateQuizById);

router.get("/myQuiz/:id", isAuthenticated, getQuizByIdForAnalytics);

router.get("/getQuiz/:id", getQuizById);

// router.get("/getQuizAnalytics/", getQuizByIdForAnalytics);

router.post("/userRes/:id", updateQuizCount);

export default router;
