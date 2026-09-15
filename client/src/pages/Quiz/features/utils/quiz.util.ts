import { v4 as uuid } from "uuid";

import type { QuizQuestion, QuizType } from "../types/quiz.types";

export function createEmptyQuestion(quizType: QuizType = "QA"): QuizQuestion {
  const question: QuizQuestion = {
    _id: uuid(),
    optionType: "text",
    questionTitle: "",
    timer: "",
    options: [
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
    ],
  };

  if (quizType === "QA") {
    question.correctAnswer = "";
  }

  return question;
}
