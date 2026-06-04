import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export default function SuccessBadge({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400);
    const t2 = setTimeout(onDone, 1750);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-live="assertive"
      role="status"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.22)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 350ms ease',
        pointerEvents: 'none',
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: 76, height: 76, borderRadius: '50%',
          background: '#34C759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(52,199,89,0.42)',
        }}
      >
        <Check size={38} style={{ color: '#ffffff', strokeWidth: 2.5 }} aria-hidden="true" />
      </div>
      <span className="sr-only">Note generated successfully</span>
    </div>
  );
}
