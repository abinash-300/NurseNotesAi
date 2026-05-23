import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="text-2xl sm:text-3xl shrink-0">🩺</span>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight leading-tight">
            NurseNote AI
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-mono uppercase tracking-widest truncate">
            Voice Documentation System
          </p>
        </div>
      </div>
      <span className="shrink-0 text-[10px] sm:text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
        MVP v0.1
      </span>
    </header>
  );
}
