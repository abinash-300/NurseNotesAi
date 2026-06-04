import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 300);
    const t2 = setTimeout(() => setPhase('out'),  1300);
    const t3 = setTimeout(() => onDone(),          1650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = phase !== 'out';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#ffffff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 0,
        opacity: visible ? 1 : 0,
        transition: visible ? 'none' : 'opacity 350ms ease-in',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #06B6D4, #0891b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(6,182,212,0.30)',
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'scale(0.82)' : 'scale(1)',
          transition: 'opacity 300ms ease-out, transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Stethoscope SVG */}
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      </div>

      <div
        style={{
          fontSize: 30, fontWeight: 700, color: '#000000',
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 300ms ease-out 80ms, transform 300ms ease-out 80ms',
        }}
      >
        NurseNote
      </div>

      <div
        style={{
          fontSize: 14, color: '#8E8E93', marginTop: 5,
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 300ms ease-out 160ms',
        }}
      >
        AI-powered clinical notes
      </div>
    </div>
  );
}
