import React, { useState } from "react";
import SignupForm from "./components/signupForm";
import LoginForm from "./components/loginForm";

type AuthTab = "register" | "login";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FAF9F6] p-6 text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900 overflow-hidden">
      {/* Playful Decorative Background Accents */}
      <div className="absolute top-12 left-12 w-24 h-24 rounded-full bg-violet-200/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 rounded-3xl bg-amber-100/60 rotate-12 blur-2xl pointer-events-none" />

      {/* Decorative Floating Pill Shape */}
      <div className="absolute -top-6 right-1/4 w-12 h-24 rounded-full bg-violet-100/80 -rotate-45 pointer-events-none hidden md:block" />

      <div className="relative w-full max-w-[440px] space-y-8">
        {/* Brand Editorial Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            Quiz & Knowledge Engine
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-serif italic">
            Quizzie<span className="text-violet-600 font-sans not-italic">.</span>
          </h1>

          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Craft engaging quizzes, analyze responses, and learn faster together.
          </p>
        </div>

        {/* Soft Segmented Control Switcher */}
        <div className="relative p-1 bg-slate-200/60 backdrop-blur-sm rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`relative flex-1 py-2.5 text-xs font-bold tracking-wide rounded-xl transition-all duration-300 ${
              activeTab === "register" ? "bg-white text-violet-950 shadow-sm shadow-slate-200/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`relative flex-1 py-2.5 text-xs font-bold tracking-wide rounded-xl transition-all duration-300 ${
              activeTab === "login" ? "bg-white text-violet-950 shadow-sm shadow-slate-200/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Dynamic Form View */}
        <div className="transition-all duration-300">{activeTab === "register" ? <SignupForm /> : <LoginForm />}</div>
      </div>
    </div>
  );
};

export default AuthPage;
