import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { Calendar, Eye, CheckCircle2, XCircle, Users, BarChart3, HelpCircle } from "lucide-react";

import { Context } from "@/main";
import { server } from "@/App";

import CustomLoader from "@/components/CustomLoader";

interface Option {
  _id: string;
  optionTitle?: string;
  count: number;
}

interface Question {
  _id: string;
  questionTitle: string;
  options?: Option[];
  correctAnswer?: string;
  totalAttempts?: number;
  correctAttempt?: number;
  incorrectAttempt?: number;
}

interface Quiz {
  _id: string;
  quizName: string;
  quizType: "QA" | "Poll";
  quizCount: number;
  createdAt: string;
  questions: Question[];
}

interface ApiResponse {
  quiz: Quiz;
}

const QuestionAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setLoading, loading } = useContext(Context);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setIsFetching(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<ApiResponse>(`${server}/quiz/myQuiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.quiz && isMounted) {
          const quiz = response.data.quiz;

          // Calculate correct and incorrect attempts for QA quiz type
          if (quiz.quizType === "QA") {
            quiz.questions = quiz.questions?.map((question) => {
              let incorrect = 0;
              let correct = 0;

              question.options?.forEach((option) => {
                if (question.correctAnswer === option._id) {
                  correct = option.count;
                } else {
                  incorrect += option.count;
                }
              });

              return {
                ...question,
                correctAttempt: correct,
                incorrectAttempt: incorrect,
              };
            });
          }

          setSelectedQuiz(quiz);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching question analysis:", axiosError);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, setLoading]);

  // Full-screen loader while fetching data
  if (loading || isFetching) {
    return <CustomLoader fullScreen label="Fetching Question Analytics..." />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900">
      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {selectedQuiz ? (
          <>
            {/* Top Bar Header Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 mb-2">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>{selectedQuiz.quizType === "QA" ? "Q&A Analysis" : "Poll Analytics"}</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif italic">
                    {selectedQuiz.quizName}
                    <span className="text-violet-600 font-sans not-italic"> Analysis.</span>
                  </h1>
                </div>

                {/* Stat Badges */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-2.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div className="text-left">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Created On</p>
                      <p className="text-xs font-bold text-slate-700">{moment(selectedQuiz.createdAt).format("DD MMM, YYYY")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-violet-50/60 border border-violet-100 px-4 py-2.5">
                    <Eye className="h-4 w-4 text-violet-600" />
                    <div className="text-left">
                      <p className="text-[10px] font-medium text-violet-500 uppercase tracking-wider">Impressions</p>
                      <p className="text-xs font-bold text-violet-700">{numeral(selectedQuiz.quizCount).format("0.0a").toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">Detailed response distribution and performance breakdown across all questions.</p>
            </div>

            {/* POLL TYPE ANALYSIS */}
            {selectedQuiz.quizType === "Poll" && (
              <div className="space-y-6">
                {selectedQuiz.questions.map((question, index) => (
                  <div
                    key={question._id || index}
                    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-violet-600 font-serif italic">Q.{index + 1}</span>
                      <span>{question.questionTitle}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {question.options?.map((option, optionIndex) => (
                        <div
                          key={option._id || optionIndex}
                          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1 hover:border-violet-200 transition-colors"
                        >
                          <span className="text-2xl font-black text-violet-600">{option.count}</span>
                          <span className="text-xs font-medium text-slate-500">{option.optionTitle || `Option ${optionIndex + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Q&A TYPE ANALYSIS */}
            {selectedQuiz.quizType === "QA" && (
              <div className="space-y-6">
                {selectedQuiz.questions.map((question, index) => (
                  <div
                    key={question._id || index}
                    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-violet-600 font-serif italic">Q.{index + 1}</span>
                      <span>{question.questionTitle}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Total Attempted Card */}
                      <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200/60 text-slate-600 mb-1">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-black text-slate-800">{question.totalAttempts ?? 0}</span>
                        <span className="text-xs font-semibold text-slate-500">People Attempted</span>
                      </div>

                      {/* Correct Attempts Card */}
                      <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center space-y-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-black text-emerald-600">{question.correctAttempt ?? 0}</span>
                        <span className="text-xs font-semibold text-emerald-700">Answered Correctly</span>
                      </div>

                      {/* Incorrect Attempts Card */}
                      <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-rose-50/60 border border-rose-100 text-center space-y-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-1">
                          <XCircle className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-black text-rose-600">{question.incorrectAttempt ?? 0}</span>
                        <span className="text-xs font-semibold text-rose-700">Answered Incorrectly</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Empty / Not Found State */
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Quiz Analysis Not Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">The requested quiz could not be loaded or may have been deleted.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestionAnalysisPage;
