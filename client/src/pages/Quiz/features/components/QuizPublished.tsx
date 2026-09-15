import { CheckCircle2, Copy } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

interface QuizPublishedProps {
  quizId: string;
  onDashboard: () => void;
}

export function QuizPublished({ quizId, onDashboard }: QuizPublishedProps) {
  const quizUrl = `${window.location.origin}/quiz/${quizId}`;

  const handleCopy = () => {
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-black italic text-slate-900">Congrats! Your Quiz is Published.</h2>

          <p className="text-xs text-slate-500">Share this link with participants to start collecting responses.</p>
        </div>

        <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 p-2 pr-3">
          <input
            type="text"
            readOnly
            value={quizUrl}
            className="w-full truncate bg-transparent px-2 text-xs font-semibold text-slate-700 outline-none"
          />

          <CopyToClipboard text={quizUrl} onCopy={handleCopy}>
            <Button
              type="button"
              className="ml-2 inline-flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </CopyToClipboard>
        </div>

        <Button
          type="button"
          onClick={onDashboard}
          className="h-11 w-full rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
