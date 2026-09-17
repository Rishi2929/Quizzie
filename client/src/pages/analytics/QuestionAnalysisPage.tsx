import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { Calendar, Eye, CheckCircle2, XCircle, Users, BarChart3, HelpCircle, ArrowLeft, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import { server } from "@/App";
import SkeletonComp from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const entrance = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const QuestionAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);

      try {
        const response = await axios.get<ApiResponse>(`${server}/quiz/myQuiz/${id}`, {
          withCredentials: true,
        });

        if (!response.data.quiz || !isMounted) {
          return;
        }

        const quiz = response.data.quiz;

        if (quiz.quizType === "QA") {
          quiz.questions = quiz.questions?.map((question) => {
            let correct = 0;
            let incorrect = 0;

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
      } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error fetching question analysis:", axiosError);

        if (isMounted) {
          setSelectedQuiz(null);
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isFetching) {
    return <SkeletonComp />;
  }

  return (
    <main className="crystal-page h-full min-h-0 overflow-hidden text-ink selection:bg-brand/20">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-200/30 blur-[120px]" />

        <div className="absolute -right-40 top-[32%] h-[460px] w-[460px] rounded-full bg-amber-100/40 blur-[120px]" />

        <div className="absolute bottom-[-220px] left-[35%] h-[500px] w-[500px] rounded-full bg-indigo-100/25 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        {selectedQuiz ? (
          <>
            {/* HEADER */}
            <motion.header
              initial="hidden"
              animate="visible"
              variants={entrance}
              transition={{ duration: 0.5 }}
              className="glass-panel relative shrink-0 overflow-hidden rounded-3xl border border-border p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-200/40 blur-[100px]" />

              <div className="relative">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-brand/20 bg-brand/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-brand"
                      >
                        <BarChart3 className="mr-1.5 size-3" />

                        {selectedQuiz.quizType === "QA" ? "Q&A Analysis" : "Poll Analytics"}
                      </Badge>

                      <span className="size-1.5 rounded-full bg-success" />

                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Question Insights</span>
                    </div>

                    <h1 className="mt-4 truncate text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                      {selectedQuiz.quizName}
                      <span className="text-brand"> Analysis.</span>
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Detailed response distribution and performance breakdown across all questions.
                    </p>
                  </div>

                  <Button variant="outline" onClick={() => window.history.back()} className="w-fit rounded-xl border-border bg-glass">
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                  {/* Created */}
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-glass-strong px-4 py-2.5">
                    <Calendar className="size-4 text-muted-foreground" />

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Created On</p>

                      <p className="mt-0.5 text-xs font-semibold">{moment(selectedQuiz.createdAt).format("DD MMM, YYYY")}</p>
                    </div>
                  </div>

                  {/* Impressions */}
                  <div className="flex items-center gap-2 rounded-2xl border border-brand/15 bg-brand/5 px-4 py-2.5">
                    <Eye className="size-4 text-brand" />

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-brand">Impressions</p>

                      <p className="mt-0.5 text-xs font-semibold text-brand">
                        {numeral(selectedQuiz.quizCount).format("0.0a").toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-glass-strong px-4 py-2.5">
                    <CircleDot className="size-4 text-muted-foreground" />

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Questions</p>

                      <p className="mt-0.5 text-xs font-semibold">{selectedQuiz.questions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.header>

            {/* QUESTIONS AREA */}
            <section className="mt-7 flex min-h-0 flex-1 flex-col">
              {/* Section Header */}
              <div className="flex shrink-0 items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">Breakdown</p>

                  <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em]">Question Performance</h2>

                  <p className="mt-1 text-sm text-muted-foreground">See how participants responded to each question.</p>
                </div>

                <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
                  {selectedQuiz.questions.length} questions
                </span>
              </div>

              {/* ====================================================== */}
              {/* POLL */}
              {/* ====================================================== */}

              {selectedQuiz.quizType === "Poll" && (
                <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
                  <div className="space-y-5 pb-6">
                    {selectedQuiz.questions.map((question, index) => (
                      <motion.div
                        key={question._id || index}
                        initial="hidden"
                        animate="visible"
                        variants={entrance}
                        transition={{
                          duration: 0.45,
                          delay: 0.05 * index,
                        }}
                        className="glass-panel relative overflow-hidden rounded-3xl border border-border p-5 sm:p-6"
                      >
                        <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-violet-100/50 blur-3xl" />

                        {/* Question */}
                        <div className="relative flex items-start gap-3">
                          <span className="shrink-0 font-mono text-sm font-bold text-brand">Q.{index + 1}</span>

                          <h3 className="text-base font-bold leading-6">{question.questionTitle}</h3>
                        </div>

                        {/* Options */}
                        <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {question.options?.map((option, optionIndex) => (
                            <div
                              key={option._id || optionIndex}
                              className="group rounded-2xl border border-border bg-glass-strong p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-sm"
                            >
                              <div className="mx-auto grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
                                <span className="font-mono text-xs font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                              </div>

                              <p className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-brand">{option.count}</p>

                              <p className="mt-1 line-clamp-2 text-xs font-medium text-muted-foreground">
                                {option.optionTitle || `Option ${optionIndex + 1}`}
                              </p>

                              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Responses</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================== */}
              {/* Q&A */}
              {/* ====================================================== */}

              {selectedQuiz.quizType === "QA" && (
                <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
                  <div className="space-y-5 pb-6">
                    {selectedQuiz.questions.map((question, index) => {
                      const total = question.totalAttempts ?? 0;

                      const correct = question.correctAttempt ?? 0;

                      const incorrect = question.incorrectAttempt ?? 0;

                      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

                      return (
                        <motion.div
                          key={question._id || index}
                          initial="hidden"
                          animate="visible"
                          variants={entrance}
                          transition={{
                            duration: 0.45,
                            delay: 0.05 * index,
                          }}
                          className="glass-panel relative overflow-hidden rounded-3xl border border-border p-5 sm:p-6"
                        >
                          <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-100/50 blur-3xl" />

                          {/* Question */}
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="shrink-0 font-mono text-sm font-bold text-brand">Q.{index + 1}</span>

                              <h3 className="text-base font-bold leading-6">{question.questionTitle}</h3>
                            </div>

                            <Badge
                              variant="outline"
                              className="hidden shrink-0 rounded-full border-border bg-glass font-mono text-[9px] sm:flex"
                            >
                              {accuracy}% accuracy
                            </Badge>
                          </div>

                          {/* Accuracy */}
                          <div className="relative mt-5">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Accuracy</span>

                              <span className="font-mono text-[10px] font-bold text-brand">{accuracy}%</span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${accuracy}%`,
                                }}
                                transition={{
                                  duration: 0.7,
                                  delay: 0.2 + index * 0.05,
                                }}
                                className="h-full rounded-full bg-brand"
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {/* Attempted */}
                            <div className="group rounded-2xl border border-slate-200/80 bg-slate-100/60 p-4 transition-all duration-300 hover:border-slate-300 hover:bg-slate-100">
                              <div className="flex items-center justify-between">
                                <div className="grid size-9 place-items-center rounded-xl bg-slate-200 text-slate-600">
                                  <Users className="size-4" />
                                </div>

                                <span className="rounded-full bg-slate-200/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-500">
                                  Attempted
                                </span>
                              </div>

                              <p className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-slate-800">{total}</p>

                              <p className="mt-1 text-[11px] font-medium text-slate-500">People Attempted</p>
                            </div>

                            {/* Correct */}
                            <div className="group rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50">
                              <div className="flex items-center justify-between">
                                <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                                  <CheckCircle2 className="size-4" />
                                </div>

                                <span className="rounded-full bg-emerald-100/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-600">
                                  Correct
                                </span>
                              </div>

                              <p className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-emerald-600">{correct}</p>

                              <p className="mt-1 text-[11px] font-medium text-emerald-700">Answered Correctly</p>
                            </div>

                            {/* Incorrect */}
                            <div className="group rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4 transition-all duration-300 hover:border-rose-300 hover:bg-rose-50">
                              <div className="flex items-center justify-between">
                                <div className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-600">
                                  <XCircle className="size-4" />
                                </div>

                                <span className="rounded-full bg-rose-100/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-rose-600">
                                  Wrong
                                </span>
                              </div>

                              <p className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-rose-600">{incorrect}</p>

                              <p className="mt-1 text-[11px] font-medium text-rose-700">Answered Incorrectly</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          /* NOT FOUND */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entrance}
            className="glass-panel relative overflow-hidden rounded-3xl border border-border p-12 text-center"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
              <HelpCircle className="size-6" />
            </div>

            <h3 className="relative mt-5 text-lg font-bold">Quiz Analysis Not Found</h3>

            <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              The requested quiz could not be loaded or may have been deleted.
            </p>

            <Button onClick={() => window.history.back()} variant="outline" className="relative mt-6 rounded-xl border-border bg-glass">
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default QuestionAnalysisPage;
