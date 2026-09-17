import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

import type { QuizData, QuizResponse } from "../types/quiz.types";

export async function createQuiz(quiz: QuizData): Promise<QuizResponse> {
  const response = await axios.post<QuizResponse>(`${API_URL}/quiz/new`, quiz, {
    withCredentials: true,
  });

  return response.data;
}

export async function getQuiz(quizId: string): Promise<QuizResponse> {
  const response = await axios.get<QuizResponse>(`${API_URL}/quiz/myQuiz/${quizId}`, {
    withCredentials: true,
  });

  return response.data;
}

export async function updateQuiz(quizId: string, quiz: QuizData): Promise<QuizResponse> {
  const response = await axios.put<QuizResponse>(`${API_URL}/quiz/updateQuiz/${quizId}`, quiz, {
    withCredentials: true,
  });

  return response.data;
}
