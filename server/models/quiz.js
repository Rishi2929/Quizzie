import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  optionTitle: {
    type: String,
  },
  imgURL: {
    type: String,
  },
  count: {
    type: Number,
  },
});

const questionSchema = new mongoose.Schema({
  questionTitle: {
    type: String,
    required: true,
  },
  options: {
    type: [OptionSchema],
    required: true,
  },
  optionType: {
    type: String,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  totalAttempts: {
    type: Number,
  },
  timer: {
    type: String,
  },
});

const schema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  quizCount: {
    type: Number,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Quiz = mongoose.model("Quiz", schema);
