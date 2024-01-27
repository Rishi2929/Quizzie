import { Quiz } from "../models/quiz.js"; // Adjust the path based on your project structure
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, quizCount, questions } = req.body;

    // Create a new Quiz instance
    // console.dir({ quizName, quizType, quizCount, questions }, { depth: null });

    //validation for required quiz fields
    if (!(quizName && quizType && questions)) {
      return res.status(401).json({
        success: false,
        message: "Important Fields are empty"
      });
    }

    //validation for required question fields
    for (const question of questions) {
      if (!(question.questionTitle && question.optionType)) {
        return res.status(202).json({
          success: false,
          message: "Important Fields are empty"
        });
      }
      else if (quizType === "QA" && question.correctAnswer === "") {
        return res.status(202).json({
          success: false,
          message: "Important Fields are empty"
        });
      }
    }

    //validation for required option fields
    for (const question of questions) {
      for (const option of question.options) {
        if (question.optionType === "text" && option.optionTitle === "")
          return res.status(401).json({
            success: false,
            message: "Important Fields are empty"
          });
        else if (question.optionType === "imgUrl" && option.imgUrl === "")
          return res.status(401).json({
            success: false,
            message: "Important Fields are empty"
          });
        else if (question.optionType === "text-imgUrl" && (option.optionTitle === "" || option.imgUrl === ""))
          return res.status(401).json({
            success: false,
            message: "Important Fields are empty"
          });
      }
    }

    const objId = mongoose.Types.ObjectId;

    // assigning the option _id and correctAnswer to same mongoose objectId instead of client side uuid
    const newQuestions = questions.map(question => {
      let correctAnswerId = new objId();
      question.options = question.options.map(option => {
        if (option.id === question.correctAnswer) {
          question.correctAnswer = correctAnswerId;
          option._id = correctAnswerId;
        } else {
          option._id = new objId();
        }
        return option;
      });
      question._id = new objId();
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
    console.log("createQuiz: ", error);
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
    console.log("req.params: ", req.params.id);
    const userResponse = req.body || [];
    const quizId = req.params.id || "";

    if (!userResponse) return;

    const quiz = await Quiz.findOne({ _id: quizId }, { quizType: 1, questions: 1 }).lean();

    let updateRes;

    if (quiz && quiz.questions.length && quiz.quizType === "Poll") {
      for (const response of userResponse) {
        const { qId, optionId } = response;

        updateRes = await Quiz.updateOne(
          {
            _id: quizId,
            "questions._id": qId,
            "questions.options._id": optionId,
          },
          {
            $inc: {
              "questions.$.totalAttempts": 1,
            }
          }
        );

        updateRes = await Quiz.updateOne(
          {
            _id: quizId,
            "questions._id": qId,
          },
          {
            $inc: {
              "questions.$[q].options.$[o].count": 1,
            },
          },
          {
            arrayFilters: [
              { "q._id": qId },
              { "o._id": optionId },
            ],
          }
        );
      }
    }
    else if (quiz && quiz.questions.length && quiz.quizType === "QA") {
      for (const response of userResponse) {
        const { qId, optionId } = response;

        updateRes = await Quiz.updateOne(
          {
            _id: quizId,
            "questions._id": qId,
            "questions.options._id": optionId,
          },
          {
            $inc: {
              "questions.$.totalAttempts": 1,
            }
          }
        );

        updateRes = await Quiz.updateOne(
          {
            _id: quizId,
            "questions._id": qId,
            "questions.correctAnswer": optionId
          },
          {
            $inc: {
              "questions.$[q].options.$[o].count": 1,
            },
          },
          {
            arrayFilters: [
              { "q._id": qId },
              { "o._id": optionId },
            ],
          }
        );

      }
    }

    console.log("updateRes: ", updateRes);

    res.status(200).json({ success: true, message: "Your Response submitted successfully" });
  } catch (error) {
    console.log("updateQuizCount error: ", error);
    next(error);
  }
};
