import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";
import numeral from "numeral";
import { ArrowUpRight, BarChart2, Eye, FileQuestion, Pencil, Plus, Share2, Sparkles, Trash2, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkeletonComp from "@/components/Skeleton";
const API_URL = import.meta.env.VITE_API_URL;

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

const entrance = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const reduceMotion = useReducedMotion();

  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [tableData, setTableData] = useState<QuizItem[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Fetch Quizzes                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsFetching(true);
        setError(null);

        const response = await axios.get<ApiResponse>(`${API_URL}/quiz/myQuiz`, {
          withCredentials: true,
        });

        if (isMounted) {
          setTableData(response.data.quiz || []);
        }
      } catch (error) {
        const axiosError = error as AxiosError<{
          message?: string;
        }>;

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

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleDeletePopup = (id: string): void => {
    setSelectedItemId(id);
    setDeletePopup(true);
  };

  const handleDelete = async (id: string | null): Promise<void> => {
    if (!id) return;

    try {
      await axios.delete(`${API_URL}/quiz/${id}`, {
        withCredentials: true,
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

  /* ---------------------------------------------------------------------- */
  /* Question Analysis                                                      */
  /* ---------------------------------------------------------------------- */

  const handleQuestionAnalysis = (id: string): void => {
    navigate(`/ques-analysis/${id}`);
  };

  /* ---------------------------------------------------------------------- */
  /* Analytics Calculations                                                 */
  /* ---------------------------------------------------------------------- */

  const totalQuizzes = useMemo(() => tableData.length, [tableData]);

  const sortedTableData = useMemo(() => [...tableData].sort((a, b) => b.quizCount - a.quizCount), [tableData]);

  const topQuiz = sortedTableData[0] ?? null;

  const transition = reduceMotion
    ? {
        duration: 0,
      }
    : {
        duration: 0.45,
        ease: [0.2, 0.7, 0.2, 1] as const,
      };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (isFetching) {
    return <SkeletonComp />;
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                   */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden text-ink">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-rose-200/10 blur-3xl" />

          <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-violet-200/10 blur-3xl" />
        </div>

        <main className="relative flex min-h-screen items-center justify-center px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entrance}
            transition={transition}
            className="glass-panel relative w-full max-w-md overflow-hidden rounded-3xl border border-border p-6 text-center sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-rose-100/70 blur-3xl"
            />

            <div className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="size-6" />
            </div>

            <h2 className="relative mt-5 font-serif text-xl font-black text-ink">Analytics unavailable</h2>

            <p className="relative mt-2 text-sm leading-6 text-muted-foreground">{error}</p>

            <Button onClick={() => window.location.reload()} className="crystal-button relative mt-6 rounded-xl">
              Try Again
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Main                                                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      {/* Page-only ambient accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl" />

        <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-indigo-200/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        {/* ---------------------------------------------------------------- */}
        {/* PAGE HEADER                                                       */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={transition}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-brand" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand">Analytics</span>
            </div>

            <h1 className="mt-3 font-serif text-3xl font-black tracking-[-0.045em] text-ink sm:text-4xl">Your Quiz Library</h1>

            <p className="mt-1.5 max-w-xl text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
              Manage your quizzes, track engagement, and inspect question-level performance.
            </p>
          </div>

          <Button
            onClick={() => navigate("/createQuiz")}
            className="h-10 w-full rounded-xl bg-violet-600 px-5 text-xs font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200 sm:w-fit"
          >
            <Plus className="mr-1.5 size-4" />
            Create Quiz
          </Button>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* TOP PERFORMER                                                     */}
        {/* ---------------------------------------------------------------- */}

        {topQuiz && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={entrance}
            transition={{
              ...transition,
              delay: 0.12,
            }}
            className="glass-panel relative mt-7 overflow-hidden rounded-3xl border border-violet-200/70 p-5 sm:mt-8 sm:p-7"
          >
            {/* Ambient card glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-violet-200/30 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/3 size-40 rounded-full bg-amber-100/30 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Quiz identity */}
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm">
                  <Trophy className="size-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-violet-600">Top Performer</p>

                    <span className="size-1 rounded-full bg-violet-300" />

                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Most Viewed</span>
                  </div>

                  <h2 className="mt-1 truncate font-serif text-xl font-black tracking-[-0.025em] text-ink sm:text-2xl">
                    {topQuiz.quizName}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">Leading your quiz library by impressions.</p>
                </div>
              </div>

              {/* Stats + action */}
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
                <div className="rounded-2xl border border-border/70 bg-white/40 px-4 py-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Impressions</p>

                  <p className="mt-1 font-mono text-xl font-black tracking-[-0.04em] text-ink">
                    {numeral(topQuiz.quizCount).format("0.0a").toUpperCase()}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/editQuiz/${topQuiz._id}`)}
                  className="h-11 w-full rounded-xl border-border bg-glass px-4 text-xs font-semibold text-ink transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand sm:w-auto"
                >
                  View
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* QUIZ MANAGEMENT                                                   */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{
            ...transition,
            delay: 0.2,
          }}
          className="mt-8 space-y-4 sm:mt-10"
        >
          {/* Section heading */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-black tracking-[-0.035em] text-ink">Your Quizzes</h2>

                <Badge variant="outline" className="rounded-full border-border bg-glass px-2.5 py-1 font-mono text-[9px] font-bold">
                  {totalQuizzes}
                </Badge>
              </div>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Manage, share and analyse everything you've created.</p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Live analytics
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* DESKTOP TABLE                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="hidden md:block">
            <div className="glass-panel overflow-hidden rounded-3xl border border-border">
              {tableData.length === 0 ? (
                <EmptyState onCreate={() => navigate("/createQuiz")} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-muted-foreground">
                    <thead>
                      <tr className="border-b border-border bg-white/30 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="w-16 px-6 py-4 text-center">#</th>

                        <th className="px-6 py-4">Quiz</th>

                        <th className="px-6 py-4">Created</th>

                        <th className="px-6 py-4 text-center">Impressions</th>

                        <th className="px-6 py-4 text-center">Actions</th>

                        <th className="px-6 py-4 text-right">Insights</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {sortedTableData.map((row, index) => {
                        const maxImpressions = sortedTableData[0]?.quizCount || 1;

                        const percentage = Math.min(100, (row.quizCount / maxImpressions) * 100);

                        return (
                          <tr key={row._id} className="group transition-colors duration-200 hover:bg-brand/5">
                            {/* Number */}
                            <td className="px-6 py-5 text-center">
                              <span className="font-mono text-[10px] font-bold text-muted-foreground transition-colors group-hover:text-brand">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </td>

                            {/* Quiz */}
                            <td className="max-w-[280px] px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600 transition-transform duration-300 group-hover:scale-105">
                                  <Sparkles className="size-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-ink transition-colors group-hover:text-brand">{row.quizName}</p>

                                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                                    {row.questions.length} {row.questions.length === 1 ? "question" : "questions"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Created */}
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-semibold text-ink">{moment(row.createdAt).format("DD MMM, YYYY")}</p>

                                <p className="mt-0.5 text-[10px] text-muted-foreground">{moment(row.createdAt).fromNow()}</p>
                              </div>
                            </td>

                            {/* Impressions */}
                            <td className="px-6 py-5">
                              <div className="mx-auto max-w-[150px]">
                                <div className="mb-1.5 flex items-center justify-between">
                                  <span className="flex items-center gap-1 font-mono text-xs font-semibold text-ink">
                                    <Eye className="size-3.5 text-brand" />

                                    {numeral(row.quizCount).format("0.0a").toUpperCase()}
                                  </span>

                                  <span className="font-mono text-[9px] font-bold text-muted-foreground">{Math.round(percentage)}%</span>
                                </div>

                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                  <motion.div
                                    initial={{
                                      width: 0,
                                    }}
                                    animate={{
                                      width: `${percentage}%`,
                                    }}
                                    transition={{
                                      duration: reduceMotion ? 0 : 0.7,
                                      delay: 0.35 + index * 0.04,
                                      ease: [0.2, 0.7, 0.2, 1],
                                    }}
                                    className="h-full rounded-full bg-brand"
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-1">
                                {/* Edit */}
                                <Link
                                  to={`/editQuiz/${row._id}`}
                                  className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-brand/10 hover:text-brand"
                                  title="Edit Quiz"
                                >
                                  <Pencil className="size-4" />
                                </Link>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeletePopup(row._id)}
                                  className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-rose-50 hover:text-rose-600"
                                  title="Delete Quiz"
                                >
                                  <Trash2 className="size-4" />
                                </button>

                                {/* Share */}
                                <CopyToClipboard
                                  text={`${window.location.origin}/quiz/${row._id}`}
                                  onCopy={() => toast.success("Quiz link copied to clipboard!")}
                                >
                                  <button
                                    type="button"
                                    className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-violet-50 hover:text-violet-600"
                                    title="Share Link"
                                  >
                                    <Share2 className="size-4" />
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
                                className="group/analysis inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand/10 px-3 text-[10px] font-bold text-brand transition-all hover:bg-ink hover:text-white"
                              >
                                <BarChart2 className="size-3.5" />

                                <span className="hidden xl:inline">Question Analysis</span>

                                <ArrowUpRight className="size-3 transition-transform group-hover/analysis:-translate-y-0.5 group-hover/analysis:translate-x-0.5" />
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
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MOBILE QUIZ CARDS                                                */}
          {/* ---------------------------------------------------------------- */}

          <div className="space-y-3 md:hidden">
            {tableData.length === 0 ? (
              <div className="glass-panel overflow-hidden rounded-3xl border border-border">
                <EmptyState onCreate={() => navigate("/createQuiz")} />
              </div>
            ) : (
              sortedTableData.map((row, index) => (
                <MobileQuizCard
                  key={row._id}
                  row={row}
                  index={index}
                  onEdit={() => navigate(`/editQuiz/${row._id}`)}
                  onDelete={() => handleDeletePopup(row._id)}
                  onAnalysis={() => handleQuestionAnalysis(row._id)}
                />
              ))
            )}
          </div>
        </motion.section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* DELETE MODAL                                                       */}
      {/* ------------------------------------------------------------------ */}

      {deletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-md">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
            }}
            className="glass-panel relative w-full max-w-sm overflow-hidden rounded-3xl border border-border p-6 text-center shadow-[0_30px_100px_rgba(15,23,42,0.25)] sm:p-7"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-rose-100/70 blur-3xl"
            />

            <div className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="size-6" />
            </div>

            <div className="relative mt-5 space-y-2">
              <h3 className="font-serif text-lg font-black text-ink">Delete this quiz?</h3>

              <p className="text-xs leading-6 text-muted-foreground">
                This quiz and its associated data will be permanently removed. This action cannot be undone.
              </p>
            </div>

            <div className="relative mt-7 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDeletePopup(false);
                  setSelectedItemId(null);
                }}
                className="h-11 flex-1 rounded-xl border-border bg-glass text-xs font-bold text-ink hover:bg-muted"
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile Quiz Card                                                           */
/* -------------------------------------------------------------------------- */

interface MobileQuizCardProps {
  row: QuizItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onAnalysis: () => void;
}

function MobileQuizCard({ row, index, onEdit, onDelete, onAnalysis }: MobileQuizCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="glass-panel relative overflow-hidden rounded-3xl border border-border p-5"
    >
      {/* Card glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative">
        {/* Quiz identity */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
              <Sparkles className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{row.quizName}</p>

              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {row.questions.length} {row.questions.length === 1 ? "question" : "questions"}
              </p>
            </div>
          </div>

          <span className="shrink-0 font-mono text-[10px] font-bold text-muted-foreground">#{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/70 bg-white/50 p-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Impressions</p>

            <p className="mt-1 flex items-center gap-1 font-mono text-sm font-black text-ink">
              <Eye className="size-3.5 text-brand" />

              {numeral(row.quizCount).format("0.0a").toUpperCase()}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white/50 p-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Created</p>

            <p className="mt-1 truncate text-xs font-semibold text-ink">{moment(row.createdAt).format("DD MMM, YYYY")}</p>

            <p className="mt-0.5 text-[9px] text-muted-foreground">{moment(row.createdAt).fromNow()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="h-10 flex-1 rounded-xl border-border bg-white text-xs font-semibold text-ink transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
          >
            <Pencil className="mr-1.5 size-3.5" />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onAnalysis}
            className="h-10 flex-1 rounded-xl border-violet-200 bg-violet-50 text-xs font-semibold text-violet-600 transition-all hover:bg-violet-100"
          >
            <BarChart2 className="mr-1.5 size-3.5" />
            Analysis
          </Button>

          <CopyToClipboard
            text={`${window.location.origin}/quiz/${row._id}`}
            onCopy={() => toast.success("Quiz link copied to clipboard!")}
          >
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-all hover:bg-violet-50 hover:text-violet-600"
              title="Share Link"
              aria-label="Share Link"
            >
              <Share2 className="size-4" />
            </button>
          </CopyToClipboard>

          <button
            type="button"
            onClick={onDelete}
            className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-all hover:bg-rose-50 hover:text-rose-600"
            title="Delete Quiz"
            aria-label="Delete Quiz"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="px-5 py-14 text-center sm:px-6 sm:py-16"
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand"
      >
        <FileQuestion className="size-6" />
      </motion.div>

      <h3 className="mt-4 font-serif text-lg font-black text-ink">Your quiz library is empty</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Create your first quiz and start collecting responses, impressions, and insights.
      </p>

      <Button onClick={onCreate} className="crystal-button mt-5 rounded-xl">
        <Plus className="mr-1.5 size-4" />
        Create Your First Quiz
      </Button>
    </motion.div>
  );
}

export default AnalyticsPage;
