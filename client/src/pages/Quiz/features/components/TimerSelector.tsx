import { Clock } from "lucide-react";

import { TIMER_OPTIONS } from "../constants";

interface TimerSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimerSelector({ value, onChange }: TimerSelectorProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 shrink-0">
        <Clock className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Timer</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {TIMER_OPTIONS.map((timer) => (
          <button
            key={timer}
            type="button"
            onClick={() => onChange(timer)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              value === timer ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {timer === "" ? "OFF" : `${timer} sec`}
          </button>
        ))}
      </div>
    </div>
  );
}
