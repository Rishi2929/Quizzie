import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";
import numeral from "numeral";

import {
  Pencil,
  Trash2,
  Share2,
  BarChart2,
  AlertTriangle,
  FolderPlus,
  Eye,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { server } from "@/App";
import CustomLoader from "@/components/CustomLoader";

interface Question {
  _id?: string;
  [key: string]: unknown;
}

interface QuizItem {
  _id: string;
  quizName: string;
  quizCount: number;
  questions: Question[];
  createdAt: string;
}

interface ApiResponse {
  quiz: QuizItem[];
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<QuizItem[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePopup = (id: string): void => {
    setSelectedItemId(id);
    setDeletePopup(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsFetching(true);
        setError(null);

        const token = localStorage.getItem("token");

        const response = await axios.get<ApiResponse>(`${server}/quiz/myQuiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (isMounted) {
          setTableData(response.data.quiz || []);
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;

        console.error("Error fetching analytics data:", axiosError);

        if (isMounted) {
          setError(axiosError.response?.data?.message || "We couldn't load your quiz analytics.");
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string | null): Promise<void> => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${server}/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setTableData((prevData) => prevData.filter((item) => item._id !== id));

      setDeletePopup(false);
      setSelectedItemId(null);

      toast.success("Quiz deleted successfully");
    } catch (error) {
      const axiosError = error as AxiosError;

      console.error("Error deleting quiz:", axiosError);

      toast.error("Failed to delete quiz");
    }
  };

  const handleQuestionAnalysis = (id: string): void => {
    navigate(`/ques-analysis/${id}`);
  };

  /* ---------------------------------------------
     Analytics
  --------------------------------------------- */

  const totalQuizzes = tableData.length;

  const totalQuestions = tableData.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);

  const totalImpressions = tableData.reduce((sum, quiz) => sum + (quiz.quizCount || 0), 0);

  const sortedTableData = [...tableData].sort((a, b) => b.quizCount - a.quizCount);

  const topQuiz = sortedTableData[0];

  /* ---------------------------------------------
     Loading
  --------------------------------------------- */

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="space-y-8 animate-pulse">
            <div className="h-40 rounded-[2rem] bg-slate-200/60" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="h-32 rounded-3xl bg-slate-200/60" />
              <div className="h-32 rounded-3xl bg-slate-200/60" />
              <div className="h-32 rounded-3xl bg-slate-200/60" />
            </div>

            <div className="h-[420px] rounded-3xl bg-slate-200/60" />
          </div>
        </main>
      </div>
    );
  }

  /* ---------------------------------------------
     Error
  --------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-100 blur-3xl" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h2 className="relative mt-5 text-xl font-black text-slate-900">Analytics unavailable</h2>

            <p className="relative mt-2 text-sm leading-6 text-slate-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="relative mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-violet-600"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF9F6] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* =========================================================
          HERO
      ========================================================= */}

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:px-8 sm:py-10">
          {/* Decorative SVG */}
          <svg
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30"
            viewBox="0 0 500 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="390" cy="70" r="120" stroke="url(#gradient)" strokeWidth="1" />

            <circle cx="390" cy="70" r="170" stroke="url(#gradient)" strokeWidth="1" />

            <circle cx="390" cy="70" r="220" stroke="url(#gradient)" strokeWidth="1" />

            <path d="M250 260C300 210 320 130 390 70C430 35 460 20 500 10" stroke="url(#gradient)" strokeWidth="2" />

            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="500" y2="300">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#C084FC" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating glow */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300 backdrop-blur">
                <Activity className="h-3.5 w-3.5" />
                Quiz Intelligence
              </div>

              <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Your quizzes.
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
                  Your momentum.
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400">
                Track engagement, manage your quizzes, and understand what your audience is interacting with.
              </p>
            </div>

            <Link
              to="/quiz/create"
              className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(139,92,246,0.25)]"
            >
              <Sparkles className="h-4 w-4 text-violet-600" />
              Create Quiz
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* =========================================================
            KPI CARDS
        ========================================================= */}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Quizzes */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgb(0,0,0,0.07)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-50 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Library</p>

                  <p className="mt-2 text-sm font-semibold text-slate-600">Quizzes Created</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:rotate-6">
                  <FolderPlus className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight">{totalQuizzes}</span>

                <span className="mb-1 text-xs font-semibold text-emerald-500">Active</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgb(0,0,0,0.07)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-50 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Content</p>

                  <p className="mt-2 text-sm font-semibold text-slate-600">Questions Created</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:rotate-6">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight">{totalQuestions}</span>

                <span className="mb-1 text-xs font-semibold text-slate-400">Total</span>
              </div>
            </div>
          </div>

          {/* Impressions */}
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgb(0,0,0,0.07)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Reach</p>

                  <p className="mt-2 text-sm font-semibold text-slate-600">Total Impressions</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:rotate-6">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight">{numeral(totalImpressions).format("0.0a").toUpperCase()}</span>

                <span className="mb-1 text-xs font-semibold text-emerald-500">Views</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TOP QUIZ HIGHLIGHT
        ========================================================= */}

        {topQuiz && (
          <section className="relative overflow-hidden rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-500">Top Performing Quiz</p>

                  <h2 className="mt-1 max-w-md truncate text-lg font-black text-slate-900">{topQuiz.quizName}</h2>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Impressions</p>

                  <p className="mt-1 text-xl font-black text-slate-900">{numeral(topQuiz.quizCount).format("0.0a").toUpperCase()}</p>
                </div>

                <Link
                  to={`/editQuiz/${topQuiz._id}`}
                  className="group flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-950 hover:text-white"
                >
                  View
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            QUIZ TABLE
        ========================================================= */}

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Your Quizzes</h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{totalQuizzes}</span>
              </div>

              <p className="mt-1 text-xs text-slate-500">Manage, share and analyse everything you've created.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.035)]">
            {tableData.length === 0 ? (
              /* Empty State */

              <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-50 blur-3xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <FolderPlus className="h-7 w-7" />
                </div>

                <h3 className="relative mt-5 text-lg font-black text-slate-900">Your quiz library is empty</h3>

                <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Create your first quiz and start collecting responses, impressions and insights.
                </p>

                <Link
                  to="/quiz/create"
                  className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-violet-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Create Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-xs text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      <th className="w-16 px-6 py-4 text-center">#</th>

                      <th className="px-6 py-4">Quiz</th>

                      <th className="px-6 py-4">Created</th>

                      <th className="px-6 py-4 text-center">Impressions</th>

                      <th className="px-6 py-4 text-center">Actions</th>

                      <th className="px-6 py-4 text-right">Insights</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sortedTableData.map((row, index) => {
                      const maxImpressions = sortedTableData[0]?.quizCount || 1;

                      const percentage = Math.min(100, (row.quizCount / maxImpressions) * 100);

                      return (
                        <tr key={row._id} className="group transition-all duration-200 hover:bg-violet-50/30">
                          {/* Number */}

                          <td className="px-6 py-5 text-center">
                            <span className="text-[11px] font-bold text-slate-300 transition-colors group-hover:text-violet-400">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </td>

                          {/* Quiz */}

                          <td className="max-w-[280px] px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
                                <Sparkles className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-bold text-slate-900 transition-colors group-hover:text-violet-600">
                                  {row.quizName}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  {row.questions.length} {row.questions.length === 1 ? "question" : "questions"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Created */}

                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-600">{moment(row.createdAt).format("DD MMM, YYYY")}</p>

                              <p className="mt-0.5 text-[10px] text-slate-400">{moment(row.createdAt).fromNow()}</p>
                            </div>
                          </td>

                          {/* Impressions */}

                          <td className="px-6 py-5">
                            <div className="mx-auto max-w-[150px]">
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-xs font-black text-slate-800">
                                  <Eye className="h-3.5 w-3.5 text-violet-500" />

                                  {numeral(row.quizCount).format("0.0a").toUpperCase()}
                                </span>

                                <span className="text-[9px] font-bold text-slate-300">{Math.round(percentage)}%</span>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-1">
                              <Link
                                to={`/editQuiz/${row._id}`}
                                className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600"
                                title="Edit Quiz"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleDeletePopup(row._id)}
                                className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                title="Delete Quiz"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              <CopyToClipboard
                                text={`${window.location.origin}/quiz/${row._id}`}
                                onCopy={() => toast.success("Quiz link copied to clipboard!")}
                              >
                                <button
                                  type="button"
                                  className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600"
                                  title="Share Link"
                                >
                                  <Share2 className="h-4 w-4" />
                                </button>
                              </CopyToClipboard>
                            </div>
                          </td>

                          {/* Analysis */}

                          <td className="px-6 py-5 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleQuestionAnalysis(row._id)}
                              className="group/analysis inline-flex h-9 items-center gap-1.5 rounded-xl bg-violet-50 px-3 text-[10px] font-bold text-violet-600 transition-all hover:bg-slate-950 hover:text-white"
                            >
                              <BarChart2 className="h-3.5 w-3.5" />

                              <span className="hidden xl:inline">Question Analysis</span>

                              <ArrowUpRight className="h-3 w-3 transition-transform group-hover/analysis:-translate-y-0.5 group-hover/analysis:translate-x-0.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =========================================================
          DELETE MODAL
      ========================================================= */}

      {deletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/50 bg-white p-7 text-center shadow-[0_30px_100px_rgba(15,23,42,0.25)] animate-in zoom-in-95 duration-200">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-rose-100 blur-3xl" />

            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="relative mt-5 space-y-2">
              <h3 className="text-lg font-black text-slate-900">Delete this quiz?</h3>

              <p className="text-xs leading-6 text-slate-500">
                This quiz and its associated data will be permanently removed. This action cannot be undone.
              </p>
            </div>

            <div className="relative mt-7 flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setDeletePopup(false);
                  setSelectedItemId(null);
                }}
                className="h-11 flex-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => handleDelete(selectedItemId)}
                className="h-11 flex-1 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5 hover:bg-rose-700"
              >
                Delete Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
