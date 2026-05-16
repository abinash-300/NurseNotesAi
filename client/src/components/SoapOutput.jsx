import React, { useState } from 'react';

const SECTIONS = [
  {
    key: 'subjective',
    letter: 'S',
    title: 'Subjective',
    color: 'text-orange-400',
    borderColor: 'border-l-orange-400',
    delay: '0ms',
  },
  {
    key: 'objective',
    letter: 'O',
    title: 'Objective',
    color: 'text-cyan-400',
    borderColor: 'border-l-cyan-400',
    delay: '100ms',
  },
  {
    key: 'assessment',
    letter: 'A',
    title: 'Assessment',
    color: 'text-purple-400',
    borderColor: 'border-l-purple-400',
    delay: '200ms',
  },
  {
    key: 'plan',
    letter: 'P',
    title: 'Plan',
    color: 'text-emerald-400',
    borderColor: 'border-l-emerald-400',
    delay: '300ms',
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 text-xs font-mono px-2 py-1 rounded border transition-colors ${
        copied
          ? 'text-emerald-400 border-emerald-700'
          : 'text-slate-500 border-slate-700 hover:text-slate-300 hover:border-slate-500'
      }`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function SoapOutput({ soap }) {
  const [fullCopied, setFullCopied] = useState(false);

  if (!soap) return null;

  const fullNote = SECTIONS.map(
    (s) => `${s.title.toUpperCase()}:\n${soap[s.key]}`
  ).join('\n\n');

  const handleCopyFull = async () => {
    await navigator.clipboard.writeText(fullNote);
    setFullCopied(true);
    setTimeout(() => setFullCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCopyFull}
        className={`text-sm font-mono px-4 py-2 rounded-lg border transition-colors ${
          fullCopied
            ? 'text-emerald-400 border-emerald-700'
            : 'text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'
        }`}
      >
        {fullCopied ? '✓ Copied!' : '⎘ Copy Full Note'}
      </button>

      {SECTIONS.map((section) => (
        <div
          key={section.key}
          className={`bg-slate-900 border border-slate-800 border-l-[3px] ${section.borderColor} rounded-lg p-5 animate-fade-up`}
          style={{ animationDelay: section.delay }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className={`text-3xl font-bold font-mono leading-none shrink-0 ${section.color}`}>
                {section.letter}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                  {section.title}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {soap[section.key]}
                </p>
              </div>
            </div>
            <CopyButton text={soap[section.key]} />
          </div>
        </div>
      ))}
    </div>
  );
}
