import React, { useEffect, useState, useRef, useMemo } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trophy, Award, Loader2, RefreshCw } from "lucide-react";
import trophyImg from "../../../assets/trophy.png";
const API_URL = import.meta.env.VITE_API_URL;

// Type definitions for user responses and answer keys
export interface QuizUserAnswer {
  qId: string;
  optionId: string;
  [key: string]: unknown;
}

export interface QuizCorrectAnswer {
  qId: string;
  correctAnswer: string;
  [key: string]: unknown;
}

interface QuizCompletedProps {
  response?: QuizUserAnswer[];
  correctAnswers?: QuizCorrectAnswer[];
  quizId?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const QuizCompleted: React.FC<QuizCompletedProps> = ({ response = [], correctAnswers = [], quizId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const hasSubmitted = useRef<boolean>(false);

  // Prevent duplicate API calls in React 18 Strict Mode
  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const updateUserResponse = async (): Promise<void> => {
      try {
        setIsSubmitting(true);
        const res = await axios.post<ApiResponse>(`${API_URL}/quiz/userRes/${quizId}`, response);

        if (res?.data?.success) {
          toast.success(res.data.message || "Quiz submitted successfully!");
        } else {
          toast.error(res?.data?.message || "Failed to submit responses.");
        }
      } catch (error) {
        const err = error as AxiosError<ApiResponse>;
        console.error("Error submitting quiz responses:", err);
        toast.error(err.response?.data?.message || "Failed to submit score. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (quizId) {
      updateUserResponse();
    }
  }, [quizId, response]);

  // Calculate score using useMemo for efficient computation
  const score = useMemo<number>(() => {
    if (!Array.isArray(response) || !Array.isArray(correctAnswers)) return 0;

    return response.reduce((acc: number, userAns: QuizUserAnswer) => {
      const match = correctAnswers.find((ans) => ans.qId === userAns.qId && ans.correctAnswer === userAns.optionId);
      return match ? acc + 1 : acc;
    }, 0);
  }, [response, correctAnswers]);

  const totalQuestions: number = correctAnswers.length || response.length || 0;
  const percentage: number = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 transition-all sm:p-10">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Calculating your final score...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Header / Celebration Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-600 ring-1 ring-amber-200">
              <Trophy className="h-4 w-4" />
              <span>Quiz Completed</span>
            </div>

            {/* Trophy Image Hero */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute h-32 w-32 rounded-full bg-amber-100/60 blur-2xl" />
              <img
                src={trophyImg}
                alt="Trophy"
                className="relative h-36 w-36 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Winner Heading */}
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Congrats!</h1>
            <p className="mt-1 text-sm text-slate-500">You have successfully completed the test.</p>

            {/* Score Card Banner */}
            <div className="mt-6 w-full rounded-2xl bg-indigo-50/60 p-5 ring-1 ring-indigo-100">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Your Final Score</span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-indigo-700 sm:text-5xl">{score}</span>
                <span className="text-lg font-bold text-indigo-400">/ {totalQuestions}</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-900">
                <Award className="h-4 w-4 text-indigo-600" />
                <span>Score Accuracy: {percentage}%</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCompleted;
