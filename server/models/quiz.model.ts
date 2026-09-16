import mongoose, { type Types } from "mongoose";

export interface IOption {
  _id?: Types.ObjectId;
  optionTitle?: string;
  imgUrl?: string;
  count: number;
}

export interface IQuestion {
  _id?: Types.ObjectId;
  questionTitle: string;
  options: IOption[];
  optionType: string;
  correctAnswer?: Types.ObjectId;
  totalAttempts: number;
  timer: string;
}

export interface IQuiz {
  quizName: string;
  quizType: string;
  quizCount: number;
  questions: IQuestion[];
  createdAt: Date;
  user?: Types.ObjectId;
}

const optionSchema = new mongoose.Schema<IOption>({
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

const questionSchema = new mongoose.Schema<IQuestion>({
  questionTitle: {
    type: String,
    required: true,
  },

  options: {
    type: [optionSchema],
    default: [],
  },

  optionType: {
    type: String,
    required: true,
  },

  correctAnswer: {
    type: mongoose.Schema.Types.ObjectId,
  },

  totalAttempts: {
    type: Number,
    default: 0,
  },

  timer: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema<IQuiz>({
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

  questions: {
    type: [questionSchema],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
