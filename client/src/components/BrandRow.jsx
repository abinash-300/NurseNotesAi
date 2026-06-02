import React from 'react';

const STATE_BADGE = {
  idle:       { label: 'HIPAA',      bg: 'rgba(52,199,89,0.12)',   color: '#34C759', pulse: false },
  recording:  { label: 'REC',        bg: 'rgba(255,59,48,0.10)',   color: '#FF3B30', pulse: true  },
  processing: { label: 'PROCESSING', bg: 'rgba(6,182,212,0.10)',   color: '#06B6D4', pulse: true  },
};

export default function BrandRow({ state = 'idle' }) {
  const { label, bg, color, pulse } = STATE_BADGE[state] ?? STATE_BADGE.idle;
  return (
    <div
      className="relative z-10 flex items-center justify-between px-5"
      style={{ height: 54, background: '#ffffff', borderBottom: '0.5px solid #C6C6C8' }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-0.015em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        NurseNote
      </span>

      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
          padding: '4px 10px', borderRadius: 99,
          background: bg, color,
        }}
      >
        {pulse && <span className="dot animate-pulse-dot" />}
        {label}
      </span>
    </div>
  );
}
