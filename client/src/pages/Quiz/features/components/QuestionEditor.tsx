import { Plus } from "lucide-react";

import { MAX_OPTIONS } from "../constants";

import type { QuizType, OptionType, QuizOption, QuizQuestion } from "../types/quiz.types";

import { OptionEditor } from "./OptionEditor";
import { OptionTypeSelector } from "./OptionTypeSelector";
import { TimerSelector } from "./TimerSelector";

interface QuestionEditorProps {
  question: QuizQuestion;
  quizType: QuizType;

  onQuestionChange: (updates: Partial<QuizQuestion>) => void;

  onOptionTypeChange: (optionType: OptionType) => void;

  onOptionChange: (optionId: string, updates: Partial<QuizOption>) => void;

  onSelectCorrect: (optionId: string) => void;
  onAddOption: () => void;
  onDeleteOption: (optionId: string) => void;
}

export function QuestionEditor({
  question,
  quizType,
  onQuestionChange,
  onOptionTypeChange,
  onOptionChange,
  onSelectCorrect,
  onAddOption,
  onDeleteOption,
}: QuestionEditorProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
      <input
        type="text"
        placeholder={quizType === "QA" ? "Question Title..." : "Poll Question..."}
        value={question.questionTitle}
        onChange={(event) =>
          onQuestionChange({
            questionTitle: event.target.value,
          })
        }
        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />

      <OptionTypeSelector value={question.optionType} questionId={question._id} onChange={onOptionTypeChange} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Options {quizType === "QA" && "(Select Correct Answer)"}
          </span>

          {question.options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={onAddOption}
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Option
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {question.options.map((option, index) => (
            <OptionEditor
              key={option._id}
              option={option}
              index={index}
              optionType={question.optionType}
              isCorrect={quizType === "QA" ? question.correctAnswer === option._id : undefined}
              canDelete={question.options.length > 2}
              onChange={onOptionChange}
              onSelectCorrect={onSelectCorrect}
              onDelete={onDeleteOption}
            />
          ))}
        </div>
      </div>

      {quizType === "QA" && <TimerSelector value={question.timer} onChange={(timer) => onQuestionChange({ timer })} />}
    </div>
  );
}
