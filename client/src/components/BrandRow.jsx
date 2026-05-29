import React from 'react';
import { Stethoscope } from 'lucide-react';

const CHIP_CONFIGS = {
  idle:       { label: 'HIPAA mode', mod: 'chip-ok',   pulse: false },
  recording:  { label: 'Recording',  mod: 'chip-rec',  pulse: true  },
  processing: { label: 'Processing', mod: 'chip-live', pulse: true  },
};

export default function BrandRow({ state = 'idle' }) {
  const { label, mod, pulse } = CHIP_CONFIGS[state] ?? CHIP_CONFIGS.idle;
  return (
    <div
      className="relative z-10 flex items-center justify-between px-5 py-3.5"
      style={{ borderBottom: '1px solid #D1D5DB', background: '#ffffff' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-[8px] border"
          style={{
            width: 30, height: 30,
            background: '#ecfeff',
            borderColor: '#06B6D4',
            color: '#06B6D4',
          }}
        >
          <Stethoscope size={16} />
        </div>
        <div className="flex flex-col" style={{ lineHeight: 1.05 }}>
          <span style={{ fontSize: 14, letterSpacing: '-0.01em', fontWeight: 600, color: '#111827' }}>
            NurseNote
          </span>
          <span className="eyebrow" style={{ fontSize: 8.5 }}>Voice Documentation</span>
        </div>
      </div>

      <span className={`chip ${mod}`}>
        <span className={`dot${pulse ? ' animate-pulse-dot' : ''}`} />
        {label}
      </span>
    </div>
  );
}
