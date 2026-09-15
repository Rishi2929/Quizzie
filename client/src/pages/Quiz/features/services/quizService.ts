import axios from "axios";

import { server } from "@/App";

import type { QuizData, QuizResponse } from "../types/quiz.types";

export async function createQuiz(quiz: QuizData): Promise<QuizResponse> {
  const response = await axios.post<QuizResponse>(`${server}/quiz/new`, quiz, {
    withCredentials: true,
  });

  return response.data;
}

export async function getQuiz(quizId: string): Promise<QuizResponse> {
  const response = await axios.get<QuizResponse>(`${server}/quiz/myQuiz/${quizId}`, {
    withCredentials: true,
  });

  return response.data;
}

export async function updateQuiz(quizId: string, quiz: QuizData): Promise<QuizResponse> {
  const response = await axios.put<QuizResponse>(`${server}/quiz/updateQuiz/${quizId}`, quiz, {
    withCredentials: true,
  });

  return response.data;
}
