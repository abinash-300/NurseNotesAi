import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🩺</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">NurseNote AI</h1>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            Voice Documentation System
          </p>
        </div>
      </div>
      <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">
        MVP v0.1
      </span>
    </header>
  );
}
