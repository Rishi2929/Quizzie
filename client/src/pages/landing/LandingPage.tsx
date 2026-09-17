import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  FolderPlus,
  Heart,
  Link2,
  Play,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Static Data Definitions
const FEATURES = [
  {
    icon: Zap,
    title: "Easy to Create",
    description: "Build quizzes and polls in minutes with a simple, intuitive editor.",
    tone: "amber",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description: "Share quizzes with a link, QR code, or directly with your audience.",
    tone: "violet",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "See detailed insights and understand how your audience performs.",
    tone: "indigo",
  },
  {
    icon: Heart,
    title: "Engage & Learn",
    description: "Make learning, feedback, and knowledge checks more interactive.",
    tone: "rose",
  },
] as const;

const USE_CASES = [
  {
    title: "Educators",
    description: "Create engaging quizzes and knowledge checks for your students.",
    icon: "✦",
    className: "border-violet-200/70 bg-violet-50/60 hover:bg-violet-50",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    title: "Teams",
    description: "Run knowledge checks, onboarding quizzes, and team polls.",
    icon: "◉",
    className: "border-emerald-200/70 bg-emerald-50/60 hover:bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Creators",
    description: "Engage your audience with interactive content and polls.",
    icon: "✎",
    className: "border-amber-200/70 bg-amber-50/60 hover:bg-amber-50",
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    title: "Anyone",
    description: "Satisfy your curiosity, test your knowledge, and have fun.",
    icon: "☺",
    className: "border-sky-200/70 bg-sky-50/60 hover:bg-sky-50",
    iconClass: "bg-sky-100 text-sky-600",
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    icon: Plus,
    title: "Create",
    description: "Build your quiz with questions, options, images, and timers using the intuitive editor.",
  },
  {
    number: "02",
    icon: Link2,
    title: "Share",
    description: "Give your audience a simple link or QR code and let them start participating instantly.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Analyze",
    description: "See attempts, performance, correct answers, and question-level insights.",
  },
] as const;

const STATS = [
  { value: "10K+", label: "Quizzes Created" },
  { value: "500K+", label: "Questions Answered" },
  { value: "5K+", label: "Happy Users" },
  { value: "99.9%", label: "Uptime" },
] as const;

// Sub-components
function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-0.5" aria-label="Quizzie home">
      <span className="font-serif text-2xl font-black italic tracking-tighter text-slate-900 transition-colors group-hover:text-violet-600">
        Quizzie
      </span>
      <span className="text-xl font-black text-violet-600 transition-transform group-hover:rotate-12">✦</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-pulse" />
      {children}
    </span>
  );
}

function ToneIcon({ tone, children }: { tone: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    amber: "bg-amber-100 text-amber-600",
    violet: "bg-violet-100 text-violet-600",
    indigo: "bg-indigo-100 text-indigo-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return <div className={`grid h-11 w-11 place-items-center rounded-2xl ${styles[tone] ?? styles.violet}`}>{children}</div>;
}

function DashboardPreview() {
  return (
    <div className="relative">
      {/* Decorative background glow */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-violet-200/40 blur-3xl" />

      {/* Main glass window preview */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 backdrop-blur-md shadow-[0_25px_80px_rgba(70,50,140,0.12)]">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Creator Studio</span>
          <div className="h-6 w-6 rounded-lg bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-slate-100 bg-slate-50/50 p-4 sm:block">
            <div className="mb-6">
              <span className="font-serif text-lg font-black italic text-slate-900">Quizzie</span>
            </div>
            <nav className="space-y-1.5">
              <div className="rounded-xl bg-violet-100/80 px-3 py-2 text-[10px] font-bold text-violet-700">Dashboard</div>
              <div className="px-3 py-2 text-[10px] font-medium text-slate-500 hover:text-slate-900">My Quizzes</div>
              <div className="px-3 py-2 text-[10px] font-medium text-slate-500 hover:text-slate-900">Analytics</div>
              <div className="px-3 py-2 text-[10px] font-medium text-slate-500 hover:text-slate-900">Settings</div>
            </nav>
          </aside>

          {/* Canvas content */}
          <div className="min-w-0 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-lg font-black tracking-tight text-slate-900 sm:text-xl">Welcome back!</p>
                <p className="mt-0.5 text-[10px] text-slate-500">Here is what's happening with your quizzes.</p>
              </div>
              <Button
                size="sm"
                className="h-8 rounded-xl bg-violet-600 px-3 text-[10px] font-bold text-white shadow-sm hover:bg-violet-700"
              >
                <Plus className="mr-1 h-3 w-3" />
                Create Quiz
              </Button>
            </div>

            {/* Metrics */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-lg bg-violet-100 text-violet-600">
                  <Sparkles className="h-3 w-3" />
                </div>
                <p className="mt-2 font-mono text-sm font-bold text-slate-900">12</p>
                <p className="text-[8px] font-medium text-slate-400">Total Quizzes</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-lg bg-amber-100 text-amber-600">
                  <Users className="h-3 w-3" />
                </div>
                <p className="mt-2 font-mono text-sm font-bold text-slate-900">248</p>
                <p className="text-[8px] font-medium text-slate-400">Total Attempts</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
                <p className="mt-2 font-mono text-sm font-bold text-slate-900">87%</p>
                <p className="text-[8px] font-medium text-slate-400">Average Score</p>
              </div>
            </div>

            {/* Recent list */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-900">Recent Quizzes</p>
                <span className="text-[8px] font-bold text-violet-600 hover:underline cursor-pointer">View All →</span>
              </div>

              <div className="space-y-2">
                {[
                  ["Node.js Fundamentals", "10 questions", "124"],
                  ["Web Development Basics", "8 questions", "89"],
                  ["JavaScript Quiz", "15 questions", "67"],
                ].map(([name, questions, attempts], idx) => (
                  <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/90 p-2.5 shadow-2xs">
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                        idx === 0
                          ? "bg-violet-100 text-violet-600"
                          : idx === 1
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold text-slate-900">{name}</p>
                      <p className="text-[8px] text-slate-400">{questions} · recently created</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] font-bold text-slate-900">{attempts}</p>
                      <p className="text-[7px] text-slate-400">attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent badges */}
      <div className="absolute -bottom-6 -left-6 hidden w-36 -rotate-3 rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-xl transition-transform duration-300 hover:rotate-0 sm:block">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-violet-600" />
          <span className="font-mono text-[9px] font-bold text-violet-600">+42%</span>
        </div>
        <p className="mt-1.5 text-[10px] font-bold leading-tight text-slate-900">More engagement</p>
        <p className="text-[8px] text-slate-400">this month</p>
      </div>

      <div className="absolute -bottom-5 -right-5 hidden w-36 rotate-3 rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-xl transition-transform duration-300 hover:rotate-0 sm:block">
        <div className="flex items-center gap-1.5">
          <Share2 className="h-3.5 w-3.5 text-violet-600" />
          <span className="text-[9px] font-bold text-slate-900">Share anywhere</span>
        </div>
        <div className="mt-2.5 flex gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet-50 text-violet-600">
            <Link2 className="h-3.5 w-3.5" />
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet-50 text-violet-600">
            <QrCode className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF9F6] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Background gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[34rem] w-[34rem] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute left-1/3 top-[35rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/15 blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <nav className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md shadow-2xs sm:px-6">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Features
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900">
              How It Works
            </a>
            <a href="#use-cases" className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Use Cases
            </a>
            <a href="#cta" className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Get Started
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="h-9 rounded-xl px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="h-9 rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <SectionLabel>Create · Share · Engage</SectionLabel>

              <h1 className="mt-4 font-serif text-4xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.75rem]">
                Turn Questions <br />
                Into Amazing <br />
                <span className="relative italic text-violet-600">
                  Experiences
                  <span aria-hidden="true" className="absolute -bottom-1.5 left-0 h-2 w-full rounded-full bg-violet-200/80" />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Quizzie makes it easy to create interactive quizzes and polls, share them with anyone, and understand how your audience
                performs.
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-500">Perfect for educators, teams, creators, and curious minds.</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="h-12 rounded-xl bg-violet-600 px-6 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-12 rounded-xl border-slate-200 bg-white/80 px-6 text-xs font-bold text-slate-900 hover:bg-slate-100"
                >
                  <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                  See How It Works
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {["No credit card required", "Quick setup", "Create in minutes"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Check className="h-3.5 w-3.5 text-violet-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Canvas */}
            <div className="px-1 sm:px-4 lg:px-0">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Feature Grid Banner */}
        <section id="features" className="border-y border-slate-200/60 bg-white/50 backdrop-blur-xs">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-8 text-center transition-colors hover:bg-slate-50/50">
                  <div className="flex justify-center">
                    <ToneIcon tone={feature.tone}>
                      <Icon className="h-5 w-5" />
                    </ToneIcon>
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-black text-slate-900">{feature.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-[2rem] border border-violet-100 bg-violet-50/50 px-6 py-8 shadow-2xs sm:px-10">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-violet-200/60">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-mono text-3xl font-black tracking-tight text-violet-600 sm:text-4xl">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">From idea to quiz in minutes.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Quizzie keeps the entire process simple so you can focus on creating great questions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative rounded-3xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">{step.number}</span>
                  </div>
                  <h3 className="mt-6 font-serif text-xl font-black text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.description}</p>
                  <div className="mt-5 flex items-center gap-1 text-[11px] font-bold text-violet-600">
                    Learn more
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Analytics Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-10 lg:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionLabel>Powerful Insights</SectionLabel>
                <h2 className="mt-4 font-serif text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Don't just collect answers. <br />
                  <span className="italic text-violet-300">Understand them.</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
                  Quizzie gives you the data behind every quiz. Track participation, identify difficult questions, and understand how your
                  audience is performing.
                </p>
                <div className="mt-6 space-y-3">
                  {["Question-level performance", "Correct vs incorrect attempts", "Quiz engagement metrics"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-medium text-slate-200">
                      <div className="grid h-6 w-6 place-items-center rounded-lg bg-violet-500/20 text-violet-300">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Card Mockup */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg font-bold text-white">Quiz Performance</p>
                    <p className="text-[10px] text-slate-400">Node.js Fundamentals</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-bold text-emerald-400">+18.4%</span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400">Attempts</p>
                    <p className="mt-1 font-mono text-xl font-bold">248</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400">Accuracy</p>
                    <p className="mt-1 font-mono text-xl font-bold">87%</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400">Questions</p>
                    <p className="mt-1 font-mono text-xl font-bold">10</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-300">Question Accuracy</span>
                    <BarChart3 className="h-4 w-4 text-violet-400" />
                  </div>
                  <div className="flex h-28 items-end gap-2">
                    {[55, 72, 46, 88, 64, 92, 78, 58, 84, 70].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Built For Everyone</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Perfect for every use case.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Whether you are teaching, training, creating, or just having fun, Quizzie fits your needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((item) => (
              <div key={item.title} className={`rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${item.className}`}>
                <div className={`grid h-11 w-11 place-items-center rounded-2xl text-lg font-bold ${item.iconClass}`}>{item.icon}</div>
                <h3 className="mt-5 font-serif text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <section id="cta" className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-violet-50/50 p-8 text-center shadow-xl sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-violet-200/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl"
            />

            <div className="relative z-10">
              <Sparkles className="mx-auto h-7 w-7 text-violet-600" />
              <h2 className="mt-4 font-serif text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Ready to create your first quiz?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
                Start creating interactive quizzes and see what your audience really knows.
              </p>

              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="mt-6 h-12 rounded-xl bg-violet-600 px-8 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="mt-4 text-[10px] font-medium text-slate-400">Free forever · No credit card required</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span className="text-xs text-slate-400">Knowledge is better together.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Features
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              How It Works
            </a>
            <a href="#use-cases" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Use Cases
            </a>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 py-4">
          <p className="text-center text-[10px] text-slate-400">© {new Date().getFullYear()} Quizzie. Built for better questions.</p>
        </div>
      </footer>
    </div>
  );
}
