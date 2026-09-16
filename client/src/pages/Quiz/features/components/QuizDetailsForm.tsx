import { ArrowRight, HelpCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { QuizType } from "../types/quiz.types";

interface QuizDetailsFormProps {
  quizName: string;
  quizType: QuizType;

  onQuizNameChange: (value: string) => void;
  onQuizTypeChange: (value: QuizType) => void;
  onCancel?: () => void;
  onContinue?: () => void;
  mode?: "create" | "edit";
}

export function QuizDetailsForm({
  quizName,
  quizType,
  onQuizNameChange,
  onQuizTypeChange,
  onCancel,
  onContinue,
  mode = "create",
}: QuizDetailsFormProps) {
  const isCreateMode = mode === "create";

  return (
    <div className="mx-auto max-w-lg space-y-7">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <h1 className="font-serif text-3xl font-black italic tracking-tight text-slate-900">
          {isCreateMode ? "Create New Quiz" : "Edit Quiz"}
          <span className="font-sans not-italic text-violet-600">.</span>
        </h1>

        <p className="text-xs leading-5 text-slate-500">
          {isCreateMode ? "Give your quiz a name and select the evaluation format." : "Update your quiz details and evaluation format."}
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onContinue?.();
        }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_25px_80px_rgba(70,50,140,0.10)] backdrop-blur-md sm:p-8"
      >
        {/* Subtle violet glow */}
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative space-y-6">
          {/* Quiz Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Quiz Name</label>

            <input
              type="text"
              placeholder="Enter quiz title..."
              value={quizName}
              onChange={(event) => onQuizNameChange(event.target.value)}
              autoFocus
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>
          {/* Quiz Type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700">Quiz Type</label>

            <div className="grid grid-cols-2 gap-3">
              <QuizTypeButton
                selected={quizType === "QA"}
                icon={<HelpCircle className="h-5 w-5" />}
                label="Q&A Quiz"
                description="There is a correct answer"
                onClick={() => onQuizTypeChange("QA")}
              />

              <QuizTypeButton
                selected={quizType === "Poll"}
                icon={<Sparkles className="h-5 w-5" />}
                label="Poll"
                description="Collect opinions"
                onClick={() => onQuizTypeChange("Poll")}
              />
            </div>
          </div>
          {/* Actions */}

          <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onCancel?.()}
              className="h-11 flex-1 rounded-xl text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => onContinue?.()}
              className="group h-11 flex-1 rounded-xl bg-violet-600 text-xs font-semibold tracking-wide text-white shadow-md shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.99]"
            >
              {isCreateMode ? "Continue" : "Save Changes"}

              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface QuizTypeButtonProps {
  selected: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function QuizTypeButton({ selected, icon, label, description, onClick }: QuizTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-28 flex-col items-start justify-center rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-violet-500 bg-violet-50/70 shadow-sm shadow-violet-100"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/30"
      }`}
    >
      <span
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
          selected ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
        }`}
      >
        {icon}
      </span>

      <span className={`text-xs font-semibold ${selected ? "text-violet-900" : "text-slate-800"}`}>{label}</span>

      <span className="mt-0.5 text-[11px] text-slate-500">{description}</span>
    </button>
  );
}
