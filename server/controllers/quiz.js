import { Quiz } from "../models/quiz.js"; // Adjust the path based on your project structure
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, quizCount, questions } = req.body;

    // Create a new Quiz instance
    // console.dir({ quizName, quizType, quizCount, questions }, { depth: null });

    const objId = mongoose.Types.ObjectId;
    let correctAnswerId = new objId();

    // assigning the option _id and correctAnswer to same mongoose objectId instead of client side uuid
    const newQuestions = questions.map(question => {
      question.options = question.options.map(option => {
        if (option.id === question.correctAnswer) {
          question.correctAnswer = correctAnswerId;
          option._id = correctAnswerId;
        } else {
          option._id = new objId();
        }
        return option;
      });
      question.qId = new objId();
      return question;
    });

    const newQuiz = new Quiz({
      quizName,
      quizType,
      user: req.user._id,
      quizCount,
      questions: newQuestions,
    });


    // Save the new quiz to the database
    const savedQuiz = await Quiz(newQuiz).save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: savedQuiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getMyQuiz = async (req, res, next) => {
  try {
    const userid = req.user.id;

    const quiz = await Quiz.find({ user: userid });

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return next(new Errorhandler("Quiz not found", 404));
    }
    await Quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quiz Deleted!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const { quizName, quizType, quizCount, questions } = req.body;
    const quizId = req.params.id;

    // Find the existing quiz by ID
    const existingQuiz = await Quiz.findById(quizId);

    if (!existingQuiz) {
      return next(new Errorhandler("Quiz not found", 404));
    }

    // Update the quiz properties
    existingQuiz.quizName = quizName || existingQuiz.quizName;
    existingQuiz.quizType = quizType || existingQuiz.quizType;
    existingQuiz.quizCount = quizCount || existingQuiz.quizCount;
    existingQuiz.questions = questions || existingQuiz.questions;

    // Save the updated quiz to the database
    const updatedQuiz = await existingQuiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    console.log("aaa")
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);

    // Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Return the quiz to the client
    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuizCount = async (req, res, next) => {
  try {
    console.log("req.response: ", req.body);
  } catch (error) {
    console.log("updateQuizCount error: ", updateQuizCount);
  }
}
