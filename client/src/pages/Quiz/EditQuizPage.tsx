import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Save, AlertCircle, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuizType } from "./features/types/quiz.types";
import { useQuizEditor } from "./features/hooks/useQuizEditor";
import { getQuiz, updateQuiz } from "./features/services/quizService";
import { validateQuiz } from "./features/utils/quiz.validation";
import { QuestionEditor, QuestionNavigator, QuizDetailsForm } from "./features/components";

export default function EditQuizPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState<QuizType>("QA");
  const [initialQuizData, setInitialQuizData] = useState<{ quizName: string; quizType: QuizType; questions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editor = useQuizEditor(quizType);

  useEffect(() => {
    if (!id) {
      toast.error("Quiz not found");
      navigate("/dashboard");
      return;
    }

    loadQuiz(id);
  }, [id]);

  const loadQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const response = await getQuiz(quizId);

      if (!response.quiz) {
        toast.error(response.message || "Failed to load quiz");
        return;
      }

      const quiz = response.quiz;
      setQuizName(quiz.quizName);
      setQuizType(quiz.quizType);
      editor.loadQuestions(quiz.questions);

      setInitialQuizData({
        quizName: quiz.quizName,
        quizType: quiz.quizType,
        questions: quiz.questions,
      });
    } catch {
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const isDirty = useMemo(() => {
    if (!initialQuizData) return false;
    return (
      quizName !== initialQuizData.quizName ||
      quizType !== initialQuizData.quizType ||
      JSON.stringify(editor.questions) !== JSON.stringify(initialQuizData.questions)
    );
  }, [quizName, quizType, editor.questions, initialQuizData]);

  const handleReset = () => {
    if (!initialQuizData) return;
    setQuizName(initialQuizData.quizName);
    setQuizType(initialQuizData.quizType);
    editor.loadQuestions(initialQuizData.questions);
    toast.success("Reverted to original state");
  };

  const handleSave = async () => {
    if (!id) return;

    const quiz = {
      quizName,
      quizType,
      questions: editor.questions,
    };

    const validation = validateQuiz(quiz);

    if (!validation.valid) {
      toast.error(validation.message);
      if (validation.questionId) {
        editor.setSelectedQuestionId(validation.questionId);
      }
      return;
    }

    try {
      setSaving(true);
      const response = await updateQuiz(id, quiz);

      if (response.success === false) {
        toast.error(response.message || "Failed to update quiz");
        return;
      }

      toast.success(response.message || "Quiz updated successfully!");
      navigate("/analytics");
    } catch {
      toast.error("An error occurred while updating the quiz");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 w-full">
      <div className="w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="h-8 rounded-xl px-2 text-xs font-semibold text-slate-500 hover:text-slate-800 shrink-0"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <h1 className="truncate font-serif text-base sm:text-xl font-black italic text-slate-900 max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
              {quizName || "Edit Quiz"}
            </h1>

            <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
              {quizType === "QA" ? "Q&A" : "Poll"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDirty && (
              <Button
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={handleReset}
                className="h-8 rounded-xl border-slate-200 px-2.5 text-xs font-semibold text-slate-600"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}

            <Button
              disabled={saving || !isDirty}
              onClick={handleSave}
              size="sm"
              className={`h-8 rounded-xl px-3 sm:px-4 text-xs font-semibold transition-all ${
                isDirty
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200 hover:bg-violet-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  <span>Save</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* TOP SECTION: Quiz Details Form Card */}
        <div className="w-full space-y-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-sm">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Quiz Details</span>
            <QuizDetailsForm
              quizName={quizName}
              quizType={quizType}
              onQuizNameChange={setQuizName}
              onQuizTypeChange={setQuizType}
              mode="edit"
            />
          </div>

          {isDirty && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50 p-2.5 text-xs font-medium text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>You have unsaved changes.</span>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Question Navigator and Editor */}
        <div className="w-full space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-sm overflow-x-auto">
            <QuestionNavigator
              questions={editor.questions}
              selectedQuestionId={editor.selectedQuestionId}
              onSelect={editor.setSelectedQuestionId}
              onAdd={editor.addQuestion}
              onDelete={editor.deleteQuestion}
            />
          </div>

          {editor.selectedQuestion ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-sm">
              <QuestionEditor
                question={editor.selectedQuestion}
                quizType={quizType}
                onQuestionChange={editor.updateCurrentQuestion}
                onOptionTypeChange={editor.changeOptionType}
                onOptionChange={editor.updateOption}
                onSelectCorrect={editor.onSelectCorrect}
                onAddOption={editor.addOption}
                onDeleteOption={editor.deleteOption}
              />
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-400">
              <p className="text-xs sm:text-sm font-medium">Select a question to edit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
