import React from 'react';
import { Shield } from 'lucide-react';

const STATE_BADGE = {
  idle: {
    label: 'HIPAA',
    bg: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D',
    icon: 'shield', pulse: false,
  },
  recording: {
    label: 'REC',
    bg: 'rgba(255,59,48,0.10)', border: 'none', color: '#FF3B30',
    icon: null, pulse: true,
  },
  processing: {
    label: 'PROCESSING',
    bg: 'rgba(6,182,212,0.10)', border: 'none', color: '#06B6D4',
    icon: null, pulse: true,
  },
};

export default function BrandRow({ state = 'idle' }) {
  const { label, bg, border, color, icon, pulse } = STATE_BADGE[state] ?? STATE_BADGE.idle;
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
          padding: '6px 12px', borderRadius: 20,
          background: bg, border, color,
        }}
      >
        {icon === 'shield' && <Shield size={12} strokeWidth={2.5} />}
        {pulse && <span className="dot animate-pulse-dot" />}
        {label}
      </span>
    </div>
  );
}
