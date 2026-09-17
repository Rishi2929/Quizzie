import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, CheckCircle2, Eye, Sparkles, Users } from "lucide-react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

type AuthTab = "login" | "register";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF9F6] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute -right-40 top-20 h-[34rem] w-[34rem] rounded-full bg-amber-200/20 blur-3xl" />

        <div className="absolute left-1/3 top-[35rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/15 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.8) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <main className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <section className="hidden lg:block">
            {/* Logo */}
            <div className="inline-flex items-center gap-0.5">
              <span className="font-serif text-2xl font-black italic tracking-tighter text-slate-900">Quizzie</span>

              <span className="text-xl font-black text-violet-600">✦</span>
            </div>

            <div className="mt-20 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-violet-600" />

                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">Creator workspace</span>
              </div>

              <h1 className="mt-4 font-serif text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 xl:text-6xl">
                Build quizzes.
                <br />
                <span className="italic text-violet-600">Understand</span> responses.
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-500">
                Create interactive quizzes, share them with your audience, and understand how people perform from one focused workspace.
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="relative mt-12 max-w-xl">
              <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-violet-200/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_25px_80px_rgba(70,50,140,0.12)] backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Overview</p>

                    <p className="mt-1 font-serif text-lg font-black text-slate-900">Quiz performance</p>
                  </div>

                  <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                    <BarChart3 className="size-4" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <PreviewStat icon={<Eye className="size-3.5" />} label="Impressions" value="12.8K" />

                  <PreviewStat icon={<Users className="size-3.5" />} label="Responses" value="4.2K" />

                  <PreviewStat icon={<CheckCircle2 className="size-3.5" />} label="Accuracy" value="87%" />
                </div>

                <div className="mt-4 rounded-2xl border border-slate-100 bg-white/60 p-4">
                  <div className="flex h-20 items-end gap-1.5">
                    {[30, 42, 36, 55, 47, 65, 57, 73, 62, 81, 74, 90].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-violet-300/50"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex justify-between font-mono text-[8px] text-slate-400">
                    <span>MON</span>
                    <span>WED</span>
                    <span>FRI</span>
                    <span>SUN</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <section className="mx-auto w-full max-w-[440px]">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="inline-flex items-center gap-0.5">
                <span className="font-serif text-2xl font-black italic tracking-tighter text-slate-900">Quizzie</span>

                <span className="text-xl font-black text-violet-600">✦</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center lg:text-left">
              <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start">
                <span className="size-1.5 rounded-full bg-violet-600" />

                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-violet-600">
                  {activeTab === "login" ? "Welcome back" : "Get started"}
                </span>
              </div>

              <h2 className="font-serif text-3xl font-black tracking-[-0.05em] text-slate-900">
                {activeTab === "login" ? "Sign in to Quizzie" : "Create your workspace"}
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {activeTab === "login"
                  ? "Access your quizzes, analytics, and creator workspace."
                  : "Start creating quizzes and collecting insights for free."}
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-3 rounded-2xl border border-slate-200/70 bg-white/60 p-1.5 shadow-sm backdrop-blur-md">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === "login"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === "register"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Dynamic form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {activeTab === "login" ? <LoginForm /> : <SignupForm />}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <p className="mt-5 text-center font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-slate-400">
              Secure authentication · Your data stays yours
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

interface PreviewStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const PreviewStat: React.FC<PreviewStatProps> = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}

        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>

      <p className="mt-2 font-mono text-lg font-black tracking-tight text-slate-900">{value}</p>
    </div>
  );
};

export default AuthPage;
