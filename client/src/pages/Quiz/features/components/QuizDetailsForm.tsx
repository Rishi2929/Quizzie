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
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <h1 className="font-serif text-3xl font-black italic tracking-tight text-slate-900">
          Create New Quiz
          <span className="font-sans not-italic text-violet-600">.</span>
        </h1>

        <p className="text-xs text-slate-500">Give your quiz a name and select the evaluation format.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onContinue();
        }}
        className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Name</label>

          <input
            type="text"
            placeholder="Enter quiz title..."
            value={quizName}
            onChange={(event) => onQuizNameChange(event.target.value)}
            autoFocus
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Type</label>

          <div className="grid grid-cols-2 gap-3">
            <QuizTypeButton
              type="QA"
              selected={quizType === "QA"}
              icon={<HelpCircle className="h-5 w-5" />}
              label="Q&A Quiz"
              onClick={() => onQuizTypeChange("QA")}
            />

            <QuizTypeButton
              type="Poll"
              selected={quizType === "Poll"}
              icon={<Sparkles className="h-5 w-5" />}
              label="Poll Type"
              onClick={() => onQuizTypeChange("Poll")}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="h-11 flex-1 rounded-xl text-xs font-semibold text-slate-600">
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-11 flex-1 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-700"
          >
            Continue
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

interface QuizTypeButtonProps {
  type: QuizType;
  selected: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuizTypeButton({ selected, icon, label, onClick }: QuizTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
        selected
          ? "border-violet-600 bg-violet-50/50 font-bold text-violet-900"
          : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200"
      }`}
    >
      <span className="mb-1 text-violet-600">{icon}</span>

      <span className="text-xs">{label}</span>
    </button>
  );
}
