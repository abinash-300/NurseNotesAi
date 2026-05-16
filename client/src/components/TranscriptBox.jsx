import React from 'react';

export default function TranscriptBox({ transcript }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
        Transcription
      </p>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-slate-400 italic text-sm leading-relaxed">{transcript}</p>
      </div>
    </div>
  );
}
