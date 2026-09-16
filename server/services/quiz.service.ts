import mongoose, { mongo } from "mongoose";

import ErrorHandler from "../middleware/error.middleware.js";
import { Quiz, type IQuestion } from "../models/quiz.model.js";

interface CreateQuizData {
  quizName: string;
  quizType: string;
  quizCount?: number;
  questions: QuizQuestionsInput[];
}

interface QuizQuestionsInput {
  _id?: string;
  questionTitle: string;
  optionType: string;
  correctAnswer?: string;
  options: QuizOptionInput[];
  totalAttempts?: number;
  timer?: string;
}

interface QuizOptionInput {
  _id?: string;
  optionTitle?: string;
  imgUrl?: string;
  count?: number;
}

interface UpdateQuizData {
  quizName?: string;
  quizType?: string;
  quizCount?: number;
  questions?: QuizQuestionsInput[];
}

interface UserResponse {
  qId: string;
  optionId: string;
}

class QuizService {
  // ******** TRANSFORM QUESTIONS -> SERVICE ********//
  private transformQuestions(questions: QuizQuestionsInput[]): IQuestion[] {
    return questions.map((question) => {
      let correctAnswerId: mongoose.Types.ObjectId | undefined;

      const options = question.options.map((option) => {
        const optionId = new mongoose.Types.ObjectId();

        if (option._id === question.correctAnswer) {
          correctAnswerId = optionId;
        }

        return {
          _id: optionId,
          ...(option.optionTitle !== undefined && {
            optionTitle: option.optionTitle,
          }),
          ...(option.imgUrl !== undefined && {
            imgUrl: option.imgUrl,
          }),
          count: option.count ?? 0,
        };
      });

      return {
        _id: new mongoose.Types.ObjectId(),
        questionTitle: question.questionTitle,
        optionType: question.optionType,
        options,
        totalAttempts: question.totalAttempts ?? 0,
        timer: question.timer ?? "",
        ...(correctAnswerId !== undefined && {
          correctAnswer: correctAnswerId,
        }),
      };
    });
  }

  // ******** CREATE QUIZ -> SERVICE ********//
  async createQuiz(data: CreateQuizData, userId: mongoose.Types.ObjectId) {
    const { quizName, quizType, quizCount, questions } = data;

    // Quiz validation
    if (!quizName || !quizType || !questions) {
      throw new ErrorHandler("Quiz Name, quiz type or questions are missing", 400);
    }

    // Question validation
    for (const question of questions) {
      if (!question.questionTitle || !question.optionType) {
        throw new ErrorHandler("Question title or option type is missing", 400);
      }

      if (quizType === "QA" && !question.correctAnswer) {
        throw new ErrorHandler("Correct answer for a question is missing", 400);
      }
    }

    // Option validation
    for (const question of questions) {
      for (const option of question.options) {
        if (question.optionType === "text" && !option.optionTitle) {
          throw new ErrorHandler("Option title is missing", 400);
        }

        if (question.optionType === "imgUrl" && !option.imgUrl) {
          throw new ErrorHandler("Image URL for an option is missing", 400);
        }

        if (question.optionType === "text-imgUrl" && (!option.optionTitle || !option.imgUrl)) {
          throw new ErrorHandler("Option title or image URL for a text-image option is missing", 400);
        }
      }
    }

    // Generate database IDs
    const newQuestions = this.transformQuestions(questions);

    // Save quiz
    const newQuiz = await Quiz.create({
      quizName,
      quizType,
      user: userId,
      quizCount: quizCount ?? 0,
      questions: newQuestions,
    });

    return newQuiz;
  }

  // ******** GET QUIZ BY ID -> SERVICE ********//
  async getMyQuiz(userId: mongoose.Types.ObjectId) {
    return await Quiz.find({
      user: userId,
    });
  }

  // ******** DELETE QUIZ BY ID -> SERVICE ********//
  async deleteMyQuiz(quizId: string, userId: mongoose.Types.ObjectId) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    // Making sure the quiz actually belongs to the authenticated user
    if (quiz.user?.toString() !== userId.toString()) {
      throw new ErrorHandler("Unauthorized", 403);
    }

    await Quiz.deleteOne({
      _id: quizId,
    });
  }

  // ******** UPDATE QUIZ BY ID -> SERVICE ********//
  async updateQuiz(quizId: string, data: UpdateQuizData, userId: mongoose.Types.ObjectId) {
    const { quizName, quizType, quizCount, questions } = data;

    const existingQuiz = await Quiz.findById(quizId);

    if (!existingQuiz) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    if (existingQuiz.user?.toString() !== userId.toString()) {
      throw new ErrorHandler("Unauthorized", 403);
    }

    existingQuiz.quizName = quizName ?? existingQuiz.quizName;

    existingQuiz.quizType = quizType ?? existingQuiz.quizType;

    existingQuiz.quizCount = quizCount ?? existingQuiz.quizCount;

    if (questions) {
      existingQuiz.questions = this.transformQuestions(questions);
    }

    return await existingQuiz.save();
  }

  // ******** GET QUIZ BY ID -> SERVICE ********//
  async getQuizById(quizId: string, isAuthenticated?: boolean) {
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new ErrorHandler("Invalid quizId format", 400);
    }

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    // if (!isAuthenticated) {

    // }

    await Quiz.updateOne({ _id: quizId }, { $inc: { quizCount: 1 } });

    return quiz;
  }

  async getQuizByIdForAnalytics(quizId: string) {
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new ErrorHandler("Invalid quizId format", 400);
    }

    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    return quiz;
  }

  // ******** UPDATE QUIZ COUNT -> SERVICE ********//
  async updateQuizCount(quizId: string, userResponse: UserResponse[]) {
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new ErrorHandler("Invalid quizId format", 400);
    }

    if (!userResponse.length) {
      return false;
    }

    const quiz = await Quiz.findById(quizId, { quizType: 1, questions: 1 }).lean();

    if (!quiz) {
      throw new ErrorHandler("Quiz not found", 404);
    }

    if (!quiz.questions.length) {
      return false;
    }

    for (const response of userResponse) {
      const { qId, optionId } = response;

      await Quiz.updateOne(
        {
          _id: quizId,
          "questions._id": qId,
          "questions.options._id": optionId,
        },
        {
          $inc: {
            "questions.$[q].totalAttempts": 1,
            "questions.$[q].options.$[o].count": 1,
          },
        },
        {
          arrayFilters: [{ "q._id": qId }, { "o._id": optionId }],
        },
      );
    }
    return true;
  }
}

export default new QuizService();
