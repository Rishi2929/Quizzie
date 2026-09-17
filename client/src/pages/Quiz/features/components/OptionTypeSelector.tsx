import type { OptionType } from "../types/quiz.types";

interface OptionTypeSelectorProps {
  value: OptionType;
  questionId: string;
  onChange: (value: OptionType) => void;
}

const OPTIONS: {
  value: OptionType;
  label: string;
}[] = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "imgUrl",
    label: "Image URL",
  },
  {
    value: "text-imgUrl",
    label: "Text & Image URL",
  },
];

export function OptionTypeSelector({ value, questionId, onChange }: OptionTypeSelectorProps) {
  return (
    <div className="flex flex-col justify-between gap-3 border-y border-slate-100 py-4 sm:flex-row sm:items-center">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Option Type</span>

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
        {OPTIONS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={`optionType-${questionId}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="accent-violet-600"
            />

            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
