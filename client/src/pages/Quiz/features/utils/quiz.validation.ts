import type { QuizData } from "../types/quiz.types";

interface ValidationResult {
  valid: boolean;
  message: string;
  questionId?: string;
}

export function validateQuiz(quiz: QuizData): ValidationResult {
  if (!quiz.quizName.trim()) {
    return {
      valid: false,
      message: "Please enter a quiz name",
    };
  }

  if (!quiz.questions.length) {
    return {
      valid: false,
      message: "A quiz must have at least 1 question",
    };
  }

  for (let index = 0; index < quiz.questions.length; index++) {
    const question = quiz.questions[index];

    if (!question.questionTitle.trim()) {
      return {
        valid: false,
        message: `Please enter a title for Question ${index + 1}`,
        questionId: question._id,
      };
    }

    if (question.options.length < 2) {
      return {
        valid: false,
        message: `Question ${index + 1} must have at least 2 options`,
        questionId: question._id,
      };
    }

    if (quiz.quizType === "QA" && !question.correctAnswer) {
      return {
        valid: false,
        message: `Please select a correct answer for Question ${index + 1}`,
        questionId: question._id,
      };
    }
  }

  return {
    valid: true,
    message: "",
  };
}
