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
    <div className="relative z-10 flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center text-cyan-400 rounded-[8px] border"
          style={{
            width: 30, height: 30,
            background: 'linear-gradient(180deg, #0c1530, #050a1a)',
            borderColor: 'var(--navy-border-strong)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <Stethoscope size={16} />
        </div>
        <div className="flex flex-col" style={{ lineHeight: 1.05 }}>
          <span className="text-ink-1 font-semibold" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>
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
