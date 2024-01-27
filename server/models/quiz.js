import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  optionTitle: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  questionTitle: {
    type: String,
    required: true,
  },
  options: [OptionSchema],
  optionType: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  timer: {
    type: String,
    default: ""
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
  quizCount: {
    type: Number,
    default: 0,
  },
  questions: [questionSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Quiz = mongoose.model("Quiz", schema);
