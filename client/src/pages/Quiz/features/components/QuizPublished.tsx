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
    <div className="mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 text-center shadow-[0_25px_80px_rgba(70,50,140,0.10)] backdrop-blur-md sm:p-8">
        {/* Subtle violet glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative space-y-7">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-black italic tracking-tight text-slate-900">
              Quiz Published
              <span className="font-sans not-italic text-violet-600">.</span>
            </h2>

            <p className="text-xs leading-5 text-slate-500">Your quiz is ready. Share the link below with participants.</p>
          </div>

          {/* Quiz URL */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-700">Shareable Link</label>

            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <input
                type="text"
                readOnly
                value={quizUrl}
                className="min-w-0 flex-1 truncate bg-transparent px-2.5 text-xs font-medium text-slate-600 outline-none"
              />

              <CopyToClipboard text={quizUrl} onCopy={handleCopy}>
                <Button
                  type="button"
                  className="h-9 shrink-0 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200"
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy
                </Button>
              </CopyToClipboard>
            </div>
          </div>

          {/* Dashboard */}
          <Button
            type="button"
            onClick={onDashboard}
            className="group h-11 w-full rounded-xl bg-violet-600 text-xs font-semibold tracking-wide text-white shadow-md shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.99]"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
