import React from 'react';
import { Zap, ChevronRight, Activity, Lock, Smartphone } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';

const RECENT = [
  { id: '1040', title: 'Acute chest pain · 68M', time: '2h ago',    tag: 'Cardiac'   },
  { id: '1039', title: 'Post-op vitals · 54F',   time: 'Yesterday', tag: 'Recovery'  },
  { id: '1038', title: 'Wound care · 81F',        time: 'Yesterday', tag: 'Med-Surg'  },
];

const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export default function ScreenIdle({ onStart, onDemo }) {
  return (
    <div className="screen">
      <BrandRow state="idle" />

      {speechSupported ? (
        /* ── Normal hero ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-2">
          <span className="eyebrow" style={{ fontSize: 9.5 }}>READY · SESSION 1041</span>

          <MicCore onTap={onStart} size={144} />

          <div className="text-center flex flex-col gap-1.5">
            <span className="text-ink-1 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Press to begin
            </span>
            <span className="text-ink-3" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
              Speak the patient report.<br />SOAP note generated in seconds.
            </span>
          </div>

          <button className="btn-ghost" onClick={onDemo} style={{ padding: '10px 16px', marginTop: 4 }}>
            <Zap size={14} />
            <span className="font-mono" style={{ fontSize: 12, letterSpacing: '0.04em' }}>
              Load demo patient
            </span>
          </button>
        </div>
      ) : (
        /* ── Safari / unsupported browser fallback ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-2">
          {/* Icon */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 30%, rgba(251,146,60,0.20), transparent 70%)',
              border: '1px solid rgba(251,146,60,0.25)',
              boxShadow: '0 0 0 1px rgba(251,146,60,0.12), 0 8px 32px rgba(251,146,60,0.15)',
              color: '#fb923c',
            }}
          >
            <Smartphone size={34} strokeWidth={1.6} />
          </div>

          {/* Message */}
          <div className="text-center flex flex-col gap-2.5">
            <span className="text-ink-1 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Voice not available
            </span>
            <span className="text-ink-3" style={{ fontSize: 14, lineHeight: 1.6 }}>
              Safari doesn't support voice input.<br />
              Open in <span className="text-ink-1 font-medium">Chrome on Android</span> for<br />
              full voice recording.
            </span>
          </div>

          {/* Prominent demo CTA */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <button
              className="btn-primary w-full"
              onClick={onDemo}
              style={{ padding: '16px 20px', borderRadius: 16, fontSize: 15 }}
            >
              <Zap size={16} />
              Try demo patient
            </button>
            <p className="text-center font-mono text-ink-4" style={{ fontSize: 10.5, letterSpacing: '0.06em' }}>
              SEE THE FULL SOAP NOTE EXPERIENCE
            </p>
          </div>
        </div>
      )}

      {/* Recent notes */}
      <div className="relative z-10 px-4 pb-3">
        <div className="card-glass" style={{ padding: '14px 16px' }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow">Recent notes</span>
            <span className="flex items-center gap-1 text-ink-4 cursor-pointer">
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.08em' }}>SEE ALL</span>
              <ChevronRight size={12} />
            </span>
          </div>

          {RECENT.map((n, i) => (
            <div
              key={n.id}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < RECENT.length - 1 ? '1px solid var(--navy-border)' : 'none' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center text-cyan-400 rounded-[8px] flex-shrink-0"
                  style={{
                    width: 28, height: 28,
                    background: 'rgba(34,211,238,0.06)',
                    border: '1px solid rgba(34,211,238,0.15)',
                  }}
                >
                  <Activity size={14} />
                </div>
                <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
                  <span className="text-ink-1" style={{ fontSize: 13 }}>{n.title}</span>
                  <span className="font-mono text-ink-4" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                    #{n.id} · {n.time}
                  </span>
                </div>
              </div>
              <span className="chip" style={{ fontSize: 9.5 }}>{n.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-3">
        <Lock size={11} className="text-ink-5" />
        <span className="font-mono text-ink-5 uppercase" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
          End-to-end encrypted · Nothing stored
        </span>
      </div>
    </div>
  );
}
