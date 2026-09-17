import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CheckCircle2, HeartHandshake, Loader2 } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

// Define interface for expected user responses (e.g. key-value pairs of question ID to option ID)
export type PollResponseData = Record<string, unknown>;

interface PollCompletedProps {
  response: PollResponseData;
  quizId?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const PollCompleted: React.FC<PollCompletedProps> = ({ response, quizId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [, setIsSuccess] = useState<boolean>(false);
  const hasSubmitted = useRef<boolean>(false);

  useEffect(() => {
    // Prevent duplicate API calls in React 18 Strict Mode
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const updateUserResponse = async (): Promise<void> => {
      try {
        setIsSubmitting(true);
        const res = await axios.post<ApiResponse>(`${API_URL}/quiz/userRes/${quizId}`, response);

        if (res?.data?.success) {
          setIsSuccess(true);
          toast.success(res.data.message || "Response recorded!");
        } else {
          toast.error(res?.data?.message || "Something went wrong.");
        }
      } catch (error) {
        const err = error as AxiosError<ApiResponse>;
        console.error("Error submitting poll response:", err);
        toast.error(err.response?.data?.message || "Failed to submit your responses. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (quizId) {
      updateUserResponse();
    }
  }, [quizId, response]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 transition-all duration-300 sm:p-10">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Submitting your responses...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Animated Header Badge */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            {/* Main Thank You Message */}
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Thank You!</h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Your participation in this poll has been recorded successfully.
            </p>

            {/* Footer / Branding Note */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
              <HeartHandshake className="h-4 w-4 text-indigo-500" />
              <span>We appreciate your feedback!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollCompleted;
