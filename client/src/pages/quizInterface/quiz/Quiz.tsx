import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Timer, ArrowRight, AlertCircle, Check, ChevronLeft } from "lucide-react";
import QuizCompleted from "../quizPollCompleted/QuizCompleted";
import PollCompleted from "../quizPollCompleted/PollCompleted";
import SkeletonComp from "@/components/Skeleton";
const API_URL = import.meta.env.VITE_API_URL;

const Quiz = () => {
  const { id: quizId } = useParams();

  const [quizData, setQuizData] = useState<any>(null);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState<number | null>(null);
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any[]>([]);

  /* ============================================================
     FETCH QUIZ
  ============================================================ */

  useEffect(() => {
    if (!quizId) return;

    const fetchQuizData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${API_URL}/quiz/getQuiz/${quizId}`);

        if (response?.data?.success && response?.data?.quiz) {
          const quiz = response.data.quiz;

          setQuizData(quiz);

          if (quiz.questions?.length > 0) {
            setQuestionCounter(0);

            const initialTimer = quiz.questions[0]?.timer;

            setTime(initialTimer ? Number(initialTimer) : null);
          }

          setCorrectAnswers(
            quiz.questions.map((q: any) => ({
              qId: q._id,
              correctAnswer: q.correctAnswer,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  /* ============================================================
     CURRENT QUESTION
  ============================================================ */

  const currentQuestion = quizData?.questions?.[questionCounter];

  const totalQuestions = quizData?.questions?.length || 0;

  const isLastQuestion = questionCounter + 1 === totalQuestions;

  const progress = totalQuestions > 0 ? ((questionCounter + 1) / totalQuestions) * 100 : 0;

  /* ============================================================
     NEXT QUESTION
  ============================================================ */

  const nextQuestion = useCallback(() => {
    if (!quizData?.questions) return;

    if (questionCounter + 1 < quizData.questions.length) {
      const nextIndex = questionCounter + 1;

      setQuestionCounter(nextIndex);

      const nextTimer = quizData.questions[nextIndex]?.timer;

      setTime(nextTimer ? Number(nextTimer) : null);
    } else {
      setIsQuizCompleted(true);
    }
  }, [questionCounter, quizData]);

  /* ============================================================
     TIMER
  ============================================================ */

  useEffect(() => {
    if (time === null || time < 0) return;

    if (time === 0) {
      nextQuestion();
      return;
    }

    const timerId = setTimeout(() => {
      setTime((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [time, nextQuestion]);

  /* ============================================================
     SELECT OPTION
  ============================================================ */

  const handleOptionClick = (optionId: string) => {
    if (!currentQuestion) return;

    setUserResponses((prev) => {
      const existingIndex = prev.findIndex((item) => item.qId === currentQuestion._id);

      if (existingIndex > -1) {
        const updated = [...prev];

        updated[existingIndex] = {
          qId: currentQuestion._id,
          optionId,
        };

        return updated;
      }

      return [
        ...prev,
        {
          qId: currentQuestion._id,
          optionId,
        },
      ];
    });
  };

  /* ============================================================
     SELECTED OPTION
  ============================================================ */

  const selectedOption = userResponses.find((response) => response.qId === currentQuestion?._id)?.optionId;

  /* ============================================================
     OPTION COMPONENT
  ============================================================ */

  const renderOption = (option: any, index: number) => {
    const isSelected = selectedOption === option._id;

    const optionLetter = String.fromCharCode(65 + index);

    const baseClass =
      "group relative w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2";

    const selectedClass = isSelected
      ? "border-violet-600 bg-violet-50 shadow-[0_8px_25px_rgba(124,58,237,0.12)]"
      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]";

    /* TEXT */

    if (currentQuestion.optionType === "text") {
      return (
        <button key={option._id} onClick={() => handleOptionClick(option._id)} className={`${baseClass} ${selectedClass} min-h-[76px] p-4`}>
          <div className="flex items-center gap-4">
            {/* Letter */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all ${
                isSelected
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
              }`}
            >
              {isSelected ? <Check className="h-4 w-4" /> : optionLetter}
            </div>

            {/* Text */}
            <span className="flex-1 text-sm font-semibold leading-5 text-slate-800 sm:text-base">{option.optionTitle}</span>
          </div>
        </button>
      );
    }

    /* IMAGE */

    if (currentQuestion.optionType === "imgUrl") {
      return (
        <button key={option._id} onClick={() => handleOptionClick(option._id)} className={`${baseClass} ${selectedClass} p-2`}>
          <div className="relative">
            <img src={option.imgUrl} alt="Quiz option" className="aspect-[4/3] w-full rounded-xl object-cover" />

            {/* Selection indicator */}
            <div
              className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                isSelected ? "bg-violet-600 text-white" : "bg-black/30 text-white opacity-0 group-hover:opacity-100"
              }`}
            >
              {isSelected && <Check className="h-4 w-4" />}
            </div>
          </div>
        </button>
      );
    }

    /* TEXT + IMAGE */

    return (
      <button key={option._id} onClick={() => handleOptionClick(option._id)} className={`${baseClass} ${selectedClass} p-3`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <img src={option.imgUrl} alt="Quiz option" className="h-32 w-full rounded-xl object-cover sm:h-20 sm:w-28" />

          <div className="flex flex-1 items-center gap-3 px-1 pb-1 sm:pb-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isSelected ? <Check className="h-4 w-4" /> : optionLetter}
            </div>

            <span className="text-sm font-semibold text-slate-800 sm:text-base">{option.optionTitle}</span>
          </div>
        </div>
      </button>
    );
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!quizData || !quizData.questions?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] p-5">
        <div className="w-full max-w-md rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-[0_15px_50px_rgba(15,23,42,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <AlertCircle className="h-6 w-6 text-slate-400" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">Quiz Not Found</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">The requested quiz could not be loaded or has no questions available.</p>
        </div>
      </div>
    );
  }

  /* ============================================================
     COMPLETED
  ============================================================ */

  if (isQuizCompleted) {
    return quizData.quizType === "QA" ? (
      <QuizCompleted response={userResponses} correctAnswers={correctAnswers} quizId={quizId} />
    ) : (
      <PollCompleted response={userResponses} quizId={quizId} />
    );
  }

  /* ============================================================
     TIMER
  ============================================================ */

  const formattedTime =
    time !== null
      ? `${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`
      : null;

  const timerProgress = currentQuestion?.timer && time !== null ? (time / Number(currentQuestion.timer)) * 100 : 100;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      {/* ====================================================== */}
      {/* TOP BAR */}
      {/* ====================================================== */}

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
            <SparkleIcon />
          </div>

          <span className="text-sm font-black tracking-tight">Quizzie</span>
        </div>

        {/* Question counter */}
        <div className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
          {questionCounter + 1}
          <span className="mx-1.5 text-slate-300">/</span>
          {totalQuestions}
        </div>
      </header>

      {/* ====================================================== */}
      {/* PROGRESS */}
      {/* ====================================================== */}

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-violet-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ====================================================== */}
      {/* QUESTION */}
      {/* ====================================================== */}

      <main className="mx-auto w-full max-w-3xl px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
        {/* Question meta */}
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-500">Question {questionCounter + 1}</span>

          {/* Timer */}
          {formattedTime && (
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                time !== null && time <= 5
                  ? "animate-pulse border-rose-200 bg-rose-50 text-rose-600"
                  : "border-amber-200 bg-amber-50 text-amber-600"
              }`}
            >
              <Timer className="h-3.5 w-3.5" />

              <span>{formattedTime}</span>

              {/* tiny progress */}
              <div className="hidden h-1 w-12 overflow-hidden rounded-full bg-black/5 sm:block">
                <div
                  className={`h-full rounded-full ${time !== null && time <= 5 ? "bg-rose-500" : "bg-amber-500"}`}
                  style={{
                    width: `${timerProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question title */}
        <div key={currentQuestion?._id} className="animate-[questionEnter_400ms_ease-out]">
          <h1 className="max-w-2xl text-2xl font-black leading-[1.2] tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            {currentQuestion?.questionTitle}
          </h1>

          <p className="mt-3 text-xs font-medium text-slate-400">Choose the answer that feels right.</p>

          {/* Options */}
          <div className={`mt-8 grid gap-3 ${currentQuestion?.optionType === "imgUrl" ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
            {currentQuestion?.options?.map(renderOption)}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="hidden text-xs font-medium text-slate-400 sm:block">
              {selectedOption ? "Answer selected" : "Select an answer to continue"}
            </div>

            <button
              onClick={nextQuestion}
              disabled={!selectedOption}
              className={`group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all sm:w-auto sm:min-w-[170px] ${
                selectedOption
                  ? "bg-violet-600 text-white shadow-[0_10px_25px_rgba(124,58,237,0.2)] hover:-translate-y-0.5 hover:bg-violet-700 active:translate-y-0"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              <span>{isLastQuestion ? "Finish Quiz" : "Next Question"}</span>

              <ArrowRight className={`h-4 w-4 transition-transform ${selectedOption ? "group-hover:translate-x-1" : ""}`} />
            </button>
          </div>
        </div>
      </main>

      {/* ====================================================== */}
      {/* ANIMATIONS */}
      {/* ====================================================== */}

      <style>
        {`
          @keyframes questionEnter {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

/* ============================================================ */
/* SIMPLE QUIZZIE ICON */
/* ============================================================ */

const SparkleIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2L13.6 8.4L20 10L13.6 11.6L12 18L10.4 11.6L4 10L10.4 8.4L12 2Z" fill="currentColor" />
      <path d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
};

export default Quiz;
