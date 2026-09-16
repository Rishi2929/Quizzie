import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuizType } from "./features/types/quiz.types";
import { useQuizEditor } from "./features/hooks/useQuizEditor";
import { createQuiz } from "./features/services/quizService";
import { QuizDetailsForm } from "./features/components/QuizDetailsForm";
import { QuestionNavigator } from "./features/components/QuestionNavigator";
import { QuestionEditor } from "./features/components/QuestionEditor";
import { QuizPublished } from "./features/components";
import { validateQuiz } from "./features/utils/quiz.validation";

type CreateQuizStep = "details" | "questions" | "published";

export default function CreateQuizPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<CreateQuizStep>("details");

  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState<QuizType>("QA");

  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useQuizEditor(quizType);

  const handleContinue = () => {
    if (!quizName.trim()) {
      toast.error("Please enter a quiz name");
      return;
    }

    setStep("questions");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const payload = {
      quizName: quizName.trim(),
      quizType,
      questions: editor.questions,
    };

    // Client-side validation
    const validation = validateQuiz(payload);

    if (!validation.valid) {
      if (validation.questionId) {
        editor.setSelectedQuestionId(validation.questionId);
      }

      toast.error(validation.message || "Invalid quiz details");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createQuiz(payload);

      if (!response.success || !response.quiz) {
        toast.error(response.message ?? "Failed to create quiz");
        return;
      }

      setCreatedQuizId(response.quiz._id);
      setStep("published");
      toast.success("Quiz published successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error processing request";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        {step === "details" && (
          <QuizDetailsForm
            quizName={quizName}
            quizType={quizType}
            onQuizNameChange={setQuizName}
            onQuizTypeChange={setQuizType}
            onCancel={() => navigate("/dashboard")}
            onContinue={handleContinue}
          />
        )}

        {step === "questions" && (
          <div className="space-y-7">
            {/* Header */}
            <header className="flex items-start justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-violet-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
                    {quizType === "QA" ? "Q&A Quiz" : "Poll"}
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{quizName}</h2>

                <p className="mt-1 text-xs text-slate-500">Create your questions and publish your quiz.</p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep("details")}
                className="shrink-0 rounded-xl border-slate-200 bg-white/70 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <ArrowLeft className="mr-2 size-3.5" />
                Edit details
              </Button>
            </header>

            {/* Quiz Editor */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_25px_80px_rgba(70,50,140,0.08)] backdrop-blur-md sm:p-7">
              {/* Card glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-violet-200/25 blur-3xl"
              />

              <div className="relative">
                <QuestionNavigator
                  questions={editor.questions}
                  selectedQuestionId={editor.selectedQuestionId}
                  onSelect={editor.setSelectedQuestionId}
                  onDelete={editor.deleteQuestion}
                  onAdd={editor.addQuestion}
                />

                {editor.selectedQuestion && (
                  <div className="mt-7 border-t border-slate-100 pt-7">
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
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => navigate("/dashboard")}
                className="rounded-xl px-4 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group h-11 rounded-xl bg-violet-600 px-6 text-xs font-semibold tracking-wide text-white shadow-md shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Quiz"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "published" && createdQuizId && <QuizPublished quizId={createdQuizId} onDashboard={() => navigate("/dashboard")} />}
      </main>
    </div>
  );
}
