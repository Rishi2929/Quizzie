import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import type { NextFunction, Request, Response } from "express";
import quizService from "../services/quiz.service.js";
import type { ParamsDictionary } from "express-serve-static-core";

interface QuizParams extends ParamsDictionary {
  id: string;
}

export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Quiz created Successfully",
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizService.getMyQuiz(req.user._id);

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyQuiz = async (req: Request<QuizParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quizId = req.params.id;

    await quizService.deleteMyQuiz(quizId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuizById = async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizService.updateQuiz(req.params.id, req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizByIdForAnalytics = async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizService.getQuizByIdForAnalytics(req.params.id);

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuizCount = async (req: Request<QuizParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await quizService.updateQuizCount(req.params.id, req.body || []);

    if (!updated) {
      res.status(204).json({
        success: true,
        message: "Thanks for your participation",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Your response submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
