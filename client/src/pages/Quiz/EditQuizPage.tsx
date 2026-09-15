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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4">
          {/* Edit Quizzie Header */}
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="h-8 rounded-xl px-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 sm:h-9 sm:px-3"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Back</span>
            </Button>

            <div className="hidden h-4 w-px bg-slate-200 sm:block" />

            <h1 className="truncate font-serif text-xl font-black italic text-slate-900 sm:text-2xl max-w-[180px] xs:max-w-[260px] sm:max-w-xs md:max-w-md">
              {quizName || "Edit Quiz"}
            </h1>

            <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 sm:px-2.5">
              {quizType === "QA" ? "Q&A Quiz" : "Poll"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <Button
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={handleReset}
                className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-600"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}

            <Button
              disabled={saving || !isDirty}
              onClick={handleSave}
              size="sm"
              className={`h-9 rounded-xl px-5 text-xs font-semibold transition-all ${
                isDirty
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200 hover:bg-violet-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Column: Compact Settings */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Quiz Details</span>
              <QuizDetailsForm
                quizName={quizName}
                quizType={quizType}
                onQuizNameChange={setQuizName}
                onQuizTypeChange={setQuizType}
                mode="edit"
              />
            </div>

            {isDirty && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>You have unsaved changes.</span>
              </div>
            )}
          </div>

          {/* Right Column: Navigator directly above Question Editor */}
          <div className="space-y-4 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <QuestionNavigator
                questions={editor.questions}
                selectedQuestionId={editor.selectedQuestionId}
                onSelect={editor.setSelectedQuestionId}
                onAdd={editor.addQuestion}
                onDelete={editor.deleteQuestion}
              />
            </div>

            {editor.selectedQuestion ? (
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
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
                <p className="text-sm font-medium">Select a question from above to start editing.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
