import React from 'react';
import { Zap, ChevronRight, Activity, Lock, Smartphone } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';

const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

const SPECIALTIES = [
  { key: 'general',    label: 'General'    },
  { key: 'icu',        label: 'ICU'        },
  { key: 'er',         label: 'ER'         },
  { key: 'medsurg',    label: 'Med-Surg'   },
  { key: 'pediatrics', label: 'Pediatrics' },
  { key: 'cardiac',    label: 'Cardiac'    },
];

function SpecialtyRow({ specialty, onChange }) {
  return (
    <div
      className="flex gap-2 w-full"
      style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}
    >
      {SPECIALTIES.map((s) => {
        const active = specialty === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className="flex-shrink-0 font-mono"
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 11,
              letterSpacing: '0.04em',
              border: `1px solid ${active ? 'rgba(34,211,238,0.45)' : 'var(--navy-border)'}`,
              background: active ? 'rgba(34,211,238,0.10)' : 'rgba(255,255,255,0.02)',
              color: active ? '#22d3ee' : '#5f6e96',
              boxShadow: active ? '0 0 10px rgba(34,211,238,0.18)' : 'none',
              transition: 'all 180ms ease',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)   return 'Just now';
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)} min${Math.floor(secs / 60) === 1 ? '' : 's'} ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function subjectivePreview(text) {
  if (!text) return 'No subjective data';
  const words = text.trim().split(/\s+/);
  return words.slice(0, 7).join(' ') + (words.length > 7 ? '…' : '');
}

export default function ScreenIdle({ onStart, onDemo, sessions = [], onOpenSession, specialty = 'general', onSpecialtyChange }) {
  return (
    <div className="screen">
      <BrandRow state="idle" />

      {speechSupported ? (
        /* ── Normal hero ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-2">
          <span className="eyebrow" style={{ fontSize: 9.5 }}>
            READY · SESSION {1000 + sessions.length + 1}
          </span>

          <MicCore onTap={onStart} size={144} />

          <div className="text-center flex flex-col gap-1.5">
            <span className="text-ink-1 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Press to begin
            </span>
            <span className="text-ink-3" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
              Speak the patient report.<br />SOAP note generated in seconds.
            </span>
          </div>

          <SpecialtyRow specialty={specialty} onChange={onSpecialtyChange} />

          <button className="btn-ghost" onClick={onDemo} style={{ padding: '10px 16px' }}>
            <Zap size={14} />
            <span className="font-mono" style={{ fontSize: 12, letterSpacing: '0.04em' }}>
              Load demo patient
            </span>
          </button>
        </div>
      ) : (
        /* ── Safari / unsupported browser fallback ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-2">
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

          <SpecialtyRow specialty={specialty} onChange={onSpecialtyChange} />

          <div className="w-full flex flex-col gap-3">
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
            <span className="font-mono text-ink-5" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
              THIS SESSION
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center gap-2" style={{ padding: '16px 0 10px' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(34,211,238,0.05)',
                  border: '1px solid rgba(34,211,238,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3f4a6e',
                }}
              >
                <Activity size={16} />
              </div>
              <div className="text-center flex flex-col gap-1">
                <span className="text-ink-4" style={{ fontSize: 13, letterSpacing: '-0.01em' }}>
                  Your recent notes appear here
                </span>
                <span className="font-mono text-ink-5" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                  NOTES ARE KEPT FOR THIS SESSION ONLY
                </span>
              </div>
            </div>
          ) : (
            sessions.map((session, i) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2.5 cursor-pointer"
                style={{ borderBottom: i < sessions.length - 1 ? '1px solid var(--navy-border)' : 'none' }}
                onClick={() => onOpenSession(session)}
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
                    <span className="text-ink-1" style={{ fontSize: 13 }}>
                      {subjectivePreview(session.soap.subjective)}
                    </span>
                    <span className="font-mono text-ink-4" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                      #{session.id} · {timeAgo(session.meta.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="chip" style={{ fontSize: 9.5 }}>
                  {session.meta.wordsOut}w
                </span>
              </div>
            ))
          )}
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
