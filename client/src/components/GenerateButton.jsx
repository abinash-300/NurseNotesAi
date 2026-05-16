import React from 'react';

export default function GenerateButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Generating clinical documentation…</span>
        </>
      ) : (
        <span>✦ Generate SOAP Note</span>
      )}
    </button>
  );
}
