import { Trash2 } from "lucide-react";

import type { OptionType, QuizOption } from "../types/quiz.types";

interface OptionEditorProps {
  option: QuizOption;
  index: number;
  optionType: OptionType;
  isCorrect?: boolean;
  canDelete: boolean;

  onChange: (optionId: string, updates: Partial<QuizOption>) => void;

  onSelectCorrect: (optionId: string) => void;
  onDelete: (optionId: string) => void;
}

export function OptionEditor({ option, index, optionType, isCorrect, canDelete, onChange, onSelectCorrect, onDelete }: OptionEditorProps) {
  const showText = optionType === "text" || optionType === "text-imgUrl";

  const showImage = optionType === "imgUrl" || optionType === "text-imgUrl";

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border p-3 transition-all ${
        isCorrect ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200" : "border-slate-200 bg-slate-50/50"
      }`}
    >
      {isCorrect !== undefined && (
        <input
          type="radio"
          name="correct-answer"
          checked={isCorrect}
          onChange={() => onSelectCorrect(option._id)}
          className="h-4 w-4 cursor-pointer accent-emerald-600"
        />
      )}

      <div className="flex-1 space-y-2">
        {showText && (
          <input
            type="text"
            placeholder={`Option ${index + 1} Text`}
            value={option.optionTitle}
            onChange={(event) =>
              onChange(option._id, {
                optionTitle: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600"
          />
        )}

        {showImage && (
          <input
            type="url"
            placeholder={`Option ${index + 1} Image URL`}
            value={option.imgUrl}
            onChange={(event) =>
              onChange(option._id, {
                imgUrl: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600"
          />
        )}
      </div>

      {canDelete && (
        <button
          type="button"
          aria-label={`Delete option ${index + 1}`}
          onClick={() => onDelete(option._id)}
          className="p-2 text-slate-400 transition-colors hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
