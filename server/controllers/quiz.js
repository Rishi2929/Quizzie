import { Quiz } from "../models/quiz.js"; // Adjust the path based on your project structure

export const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, quizCount, questions } = req.body;

    // Create a new Quiz instance
    console.dir({ quizName, quizType, quizCount, questions }, { depth: null });
    const newQuiz = new Quiz({
      quizName,
      quizType,
      quizCount,
      questions,
      user: req.user,
    });
    // console.log(req.user)

    // Save the new quiz to the database
    const savedQuiz = await newQuiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: savedQuiz,
    });
  } catch (error) {
    // console.error("Error creating quiz:", error);
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
      message: "Task Deleted!",
    });
  } catch (error) {
    next(error);
  }
};
