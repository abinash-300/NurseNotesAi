import React from 'react';
import { Shield, User } from 'lucide-react';

const STATE_BADGE = {
  recording: {
    label: 'REC',
    bg: 'rgba(255,59,48,0.10)', border: 'none', color: '#FF3B30',
    pulse: true,
  },
  processing: {
    label: 'PROCESSING',
    bg: 'rgba(6,182,212,0.10)', border: 'none', color: '#06B6D4',
    pulse: true,
  },
};

export default function BrandRow({ state = 'idle', onProfile }) {
  const badge = STATE_BADGE[state];

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

      {/* idle: profile avatar; recording/processing: spacer for balance */}
      {state === 'idle' ? (
        <button
          onClick={onProfile}
          aria-label="Profile & settings"
          className="tap-scale"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#F2F2F7', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#8E8E93',
          }}
        >
          <User size={18} strokeWidth={1.8} />
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}

      {/* recording / processing: state badge */}
      {badge && (
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
            padding: '6px 12px', borderRadius: 20,
            background: badge.bg, border: badge.border, color: badge.color,
          }}
        >
          {badge.pulse && <span className="dot animate-pulse-dot" />}
          {badge.label}
        </span>
      )}
    </div>
  );
}
