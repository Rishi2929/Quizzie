import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import moment from "moment";
import numeral from "numeral";
import { FolderPlus, Plus, Sparkles, Eye, FileQuestion } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { server } from "@/App";
import SkeletonComp from "@/components/Skeleton";

interface Question {
  _id?: string;
  [key: string]: unknown;
}

interface Quiz {
  _id: string;
  quizName: string;
  quizCount: number;
  questions: Question[];
  createdAt: string;
}

interface MyQuizApiResponse {
  quiz: Quiz[];
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const reduceMotion = useReducedMotion();

  const [tableData, setTableData] = useState<Quiz[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);

        const response = await axios.get<MyQuizApiResponse>(`${server}/quiz/myQuiz`, {
          withCredentials: true,
        });

        setTableData(response.data.quiz || []);
      } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error fetching quiz data:", axiosError);
      } finally {
        setIsFetching(false);
      }
    };

    void fetchData();
  }, []);

  // Aggregated analytics values
  const totalQuizzes = useMemo(() => tableData.length, [tableData]);

  const totalImpressions = useMemo(() => tableData.reduce((sum, quiz) => sum + (quiz.quizCount || 0), 0), [tableData]);

  const totalQuestions = useMemo(() => tableData.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0), [tableData]);
  /*
   * Your backend currently does not return an accuracy field.
   * Keep this placeholder until accuracy is calculated from
   * question/option attempt data.
   */
  const averageAccuracy = "87%";

  const recentQuizzes = useMemo(
    () => [...tableData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [tableData],
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.4,
        ease: [0.2, 0.7, 0.2, 1] as const,
      };

  if (isFetching) {
    return <SkeletonComp />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      {/* Ambient background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-indigo-200/10 blur-3xl" />

        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={transition}
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand">Creator Studio</span>
            </div>

            <h1 className="mt-3 font-serif text-3xl font-black tracking-[-0.045em] text-ink sm:text-4xl">Welcome back.</h1>

            <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:text-sm">Here's what's happening with your quizzes.</p>
          </div>

          <Button
            onClick={() => navigate("/createQuiz")}
            className="h-10 w-fit rounded-xl bg-violet-600 px-5 text-xs font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200"
          >
            <Plus className="mr-1.5 size-4" />
            Create Quiz
          </Button>
        </motion.section>

        {/* Metrics */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            delay={0.05}
            icon={<Sparkles className="size-4" />}
            value={String(totalQuizzes)}
            label="Total Quizzes"
            accent="violet"
          />

          <MetricCard
            delay={0.1}
            icon={<Eye className="size-4" />}
            value={numeral(totalImpressions).format("0,0")}
            label="Total Impressions"
            accent="amber"
          />

          <MetricCard
            delay={0.15}
            icon={<FileQuestion className="size-4" />}
            value={numeral(totalQuestions).format("0,0")}
            label="Total Questions"
            accent="emerald"
          />
        </section>

        {/* Recent Quizzes */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{
            ...transition,
            delay: 0.2,
          }}
          className="mt-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-black tracking-[-0.025em] text-ink">Recent Quizzes</h2>

              <p className="mt-0.5 text-[11px] text-muted-foreground">Your latest created quizzes.</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
            >
              View All →
            </button>
          </div>

          {recentQuizzes.length === 0 ? (
            <EmptyState onCreate={() => navigate("/createQuiz")} />
          ) : (
            <div className="mt-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {recentQuizzes.slice(0, 5).map((quiz, idx) => (
                  <QuizItemRow key={quiz._id} quiz={quiz} index={idx} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Metric Card                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  value,
  label,
  icon,
  delay,
  accent,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
  accent: "violet" | "amber" | "emerald";
}) {
  const accentStyles = {
    violet: {
      icon: "bg-violet-100 text-violet-600",
      border: "border-violet-200/70 hover:border-violet-300/80",
      value: "text-violet-700",
    },

    amber: {
      icon: "bg-amber-100 text-amber-600",
      border: "border-amber-200/70 hover:border-amber-300/80",
      value: "text-amber-700",
    },

    emerald: {
      icon: "bg-emerald-100 text-emerald-600",
      border: "border-emerald-200/70 hover:border-emerald-300/80",
      value: "text-emerald-700",
    },
  };

  const style = accentStyles[accent];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={entrance}
      transition={{
        duration: 0.4,
        delay,
      }}
      whileHover={{
        y: -2,
      }}
      className={`glass-panel rounded-3xl border p-5 transition-all duration-300 ${style.border}`}
    >
      <div className="flex items-center justify-between">
        <div className={`grid size-9 place-items-center rounded-2xl ${style.icon}`}>{icon}</div>

        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Overview</span>
      </div>

      <p className={`mt-4 font-mono text-2xl font-black tracking-[-0.04em] ${style.value}`}>{value}</p>

      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quiz Row                                                                   */
/* -------------------------------------------------------------------------- */

function QuizItemRow({ quiz, index }: { quiz: Quiz; index: number }) {
  const icons = [
    "bg-violet-100 text-violet-600",
    "bg-indigo-100 text-indigo-600",
    "bg-amber-100 text-amber-600",
    "bg-emerald-100 text-emerald-600",
  ];

  const iconStyle = icons[index % icons.length];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.98,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
      }}
      className="glass-panel group flex items-center justify-between rounded-2xl border border-border p-4 transition-all duration-300 hover:border-brand/30 hover:bg-white/60"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconStyle}`}>
          <FolderPlus className="size-5" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xs font-bold text-ink transition-colors group-hover:text-brand">{quiz.quizName}</h3>

          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            {quiz.questions?.length || 0} questions
            <span className="mx-1.5 text-border">·</span>
            {moment(quiz.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* <div className="ml-4 shrink-0 text-right">
        <p className="font-mono text-sm font-bold text-ink">{numeral(quiz.quizCount).format("0,0")}</p>

        <p className="text-[10px] font-medium text-muted-foreground">impressions.</p>
      </div> */}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass-panel mt-6 rounded-3xl border border-dashed border-border p-10 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
        <FolderPlus className="size-6" />
      </div>

      <h3 className="mt-4 font-serif text-base font-black text-ink">No quizzes created yet</h3>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
        Create your first quiz to start tracking impressions and collecting responses.
      </p>

      <Button
        onClick={onCreate}
        className="mt-5 h-9 rounded-xl bg-brand px-4 text-xs font-semibold text-white shadow-sm shadow-brand/20 hover:bg-brand/90"
      >
        <Plus className="mr-1.5 size-3.5" />
        Create Quiz
      </Button>
    </div>
  );
}

export default DashboardPage;
