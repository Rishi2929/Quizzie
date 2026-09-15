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
      <main className="mx-auto max-w-4xl px-6 py-10">
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
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                  {quizType === "QA" ? "Q&A Quiz" : "Poll"}
                </span>

                <h2 className="font-serif text-2xl font-black italic text-slate-900">{quizName}</h2>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep("details")}
                className="rounded-xl border-slate-200 text-xs text-slate-600"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Edit Info
              </Button>
            </header>

            <QuestionNavigator
              questions={editor.questions}
              selectedQuestionId={editor.selectedQuestionId}
              onSelect={editor.setSelectedQuestionId}
              onDelete={editor.deleteQuestion}
              onAdd={editor.addQuestion}
            />

            {editor.selectedQuestion && (
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
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => navigate("/dashboard")}
                className="rounded-xl text-xs font-semibold text-slate-500"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 rounded-xl bg-violet-600 px-6 text-xs font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
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
