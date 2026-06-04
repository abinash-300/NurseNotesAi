import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

export default function CopyToast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="animate-slide-down-in"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top))',
        left: 16, right: 16,
        zIndex: 80,
        background: '#ffffff',
        borderRadius: 16,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(52,199,89,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Check size={14} style={{ color: '#34C759' }} aria-hidden="true" />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#000000' }}>{message}</span>
    </div>
  );
}
