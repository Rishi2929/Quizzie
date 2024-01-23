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
  qId: {
    type: String,
  },
  questionTitle: {
    type: String,
    // required: true,
  },
  options: [OptionSchema],
  optionType: {
    type: String,
  },
  correctAnswer: {
    type: String,
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
    // required: true,

  },
  quizType: {
    type: String,
    // required: true,
  },
  // title: {
  //   type: String,
  //   // required: true,
  // },
  quizCount: {
    type: Number,
  },
  questions: [questionSchema],

  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
});

export const Quiz = mongoose.model("Quiz", schema);
