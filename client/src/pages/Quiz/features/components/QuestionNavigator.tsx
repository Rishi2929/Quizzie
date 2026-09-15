import { Plus } from "lucide-react";

import { MAX_QUESTIONS } from "../constants";

import type { QuizQuestion } from "../types/quiz.types";

interface QuestionNavigatorProps {
  questions: QuizQuestion[];
  selectedQuestionId: string;

  onSelect: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onAdd: () => void;
}

export function QuestionNavigator({ questions, selectedQuestionId, onSelect, onDelete, onAdd }: QuestionNavigatorProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {questions.map((question, index) => {
        const isSelected = question._id === selectedQuestionId;

        return (
          <div
            key={question._id}
            className={`group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border text-xs font-bold transition-all ${
              isSelected
                ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
            }`}
            onClick={() => onSelect(question._id)}
          >
            {index + 1}

            {questions.length > 1 && (
              <button
                type="button"
                aria-label={`Delete question ${index + 1}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(question._id);
                }}
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white group-hover:flex hover:bg-rose-600"
              >
                ×
              </button>
            )}
          </div>
        );
      })}

      {questions.length < MAX_QUESTIONS && (
        <button
          type="button"
          onClick={onAdd}
          title="Add Question"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 text-violet-600 transition-colors hover:bg-violet-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}

      <span className="ml-2 whitespace-nowrap text-xs text-slate-400">Max {MAX_QUESTIONS} questions</span>
    </div>
  );
}
