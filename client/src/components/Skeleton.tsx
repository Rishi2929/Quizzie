import React from "react";

function SkeletonComp() {
  return (
    <div>
      <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="space-y-8 animate-pulse">
            <div className="h-40 rounded-[2rem] bg-slate-200/60" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="h-32 rounded-3xl bg-slate-200/60" />
              <div className="h-32 rounded-3xl bg-slate-200/60" />
              <div className="h-32 rounded-3xl bg-slate-200/60" />
            </div>

            <div className="h-[420px] rounded-3xl bg-slate-200/60" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SkeletonComp;
