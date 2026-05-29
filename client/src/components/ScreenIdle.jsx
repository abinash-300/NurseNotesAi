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
              border: `1px solid ${active ? '#06B6D4' : '#D1D5DB'}`,
              background: active ? '#ecfeff' : '#F3F4F6',
              color: active ? '#06B6D4' : '#6B7280',
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

const NOTE_LENGTH_OPTIONS = [
  { key: 'brief',    label: 'Brief'    },
  { key: 'standard', label: 'Standard' },
  { key: 'detailed', label: 'Detailed' },
];

function NoteLengthControl({ noteLength, onChange }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <span className="eyebrow" style={{ fontSize: 9, letterSpacing: '0.10em', paddingLeft: 2 }}>
        NOTE LENGTH
      </span>
      <div
        style={{
          display: 'flex',
          background: '#F3F4F6',
          border: '1px solid #D1D5DB',
          borderRadius: 10,
          padding: 3,
        }}
      >
        {NOTE_LENGTH_OPTIONS.map((opt) => {
          const active = noteLength === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                fontFamily: 'Sora, system-ui, sans-serif',
                border: 'none',
                background: active ? '#ffffff' : 'transparent',
                color: active ? '#06B6D4' : '#6B7280',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
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

export default function ScreenIdle({ onStart, onDemo, sessions = [], onOpenSession, specialty = 'general', onSpecialtyChange, noteLength = 'standard', onNoteLengthChange }) {
  return (
    <div className="screen">
      <BrandRow state="idle" />

      {speechSupported ? (
        /* ── Normal hero ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-6 pt-2">
          <span className="eyebrow" style={{ fontSize: 9.5 }}>
            READY · SESSION {1000 + sessions.length + 1}
          </span>

          {/* Ambient glow behind mic orb */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.02) 55%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <MicCore onTap={onStart} size={140} />
          </div>

          <div className="text-center flex flex-col gap-1.5">
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Press to begin
            </span>
            <span style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.45 }}>
              Speak the patient report.<br />SOAP note generated in seconds.
            </span>
          </div>

          <SpecialtyRow specialty={specialty} onChange={onSpecialtyChange} />
          <NoteLengthControl noteLength={noteLength} onChange={onNoteLengthChange} />

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
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#f97316',
            }}
          >
            <Smartphone size={34} strokeWidth={1.6} />
          </div>

          <div className="text-center flex flex-col gap-2.5">
            <span style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.015em' }}>
              Voice not available
            </span>
            <span style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
              Safari doesn't support voice input.<br />
              Open in <span style={{ color: '#111827', fontWeight: 600 }}>Chrome on Android</span> for<br />
              full voice recording.
            </span>
          </div>

          <SpecialtyRow specialty={specialty} onChange={onSpecialtyChange} />
          <NoteLengthControl noteLength={noteLength} onChange={onNoteLengthChange} />

          <div className="w-full flex flex-col gap-3">
            <button
              className="btn-primary w-full"
              onClick={onDemo}
              style={{ padding: '16px 20px', borderRadius: 16, fontSize: 15 }}
            >
              <Zap size={16} />
              Try demo patient
            </button>
            <p className="text-center font-mono" style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#9CA3AF' }}>
              SEE THE FULL SOAP NOTE EXPERIENCE
            </p>
          </div>
        </div>
      )}

      {/* Recent notes */}
      <div className="relative z-10 px-4 pb-3">
        <div
          style={{
            background: '#F3F4F6',
            border: '1px solid #D1D5DB',
            borderRadius: 16,
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow">Recent notes</span>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: '#9CA3AF' }}>
              THIS SESSION
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center gap-2" style={{ padding: '16px 0 10px' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: '#ecfeff',
                  border: '1px solid rgba(6,182,212,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#06B6D4',
                }}
              >
                <Activity size={16} />
              </div>
              <div className="text-center flex flex-col gap-1">
                <span style={{ fontSize: 13, color: '#6B7280', letterSpacing: '-0.01em' }}>
                  Your recent notes appear here
                </span>
                <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#9CA3AF' }}>
                  NOTES ARE KEPT FOR THIS SESSION ONLY
                </span>
              </div>
            </div>
          ) : (
            sessions.map((session, i) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2.5 cursor-pointer"
                style={{
                  borderBottom: i < sessions.length - 1 ? '1px solid #D1D5DB' : 'none',
                  borderRadius: 8,
                  padding: '10px 8px',
                  margin: '0 -8px',
                  transition: 'background 150ms',
                }}
                onClick={() => onOpenSession(session)}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-[8px] flex-shrink-0"
                    style={{
                      width: 28, height: 28,
                      background: '#ecfeff',
                      border: '1px solid rgba(6,182,212,0.20)',
                      color: '#06B6D4',
                    }}
                  >
                    <Activity size={14} />
                  </div>
                  <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
                    <span style={{ fontSize: 13, color: '#111827' }}>
                      {subjectivePreview(session.soap.subjective)}
                    </span>
                    <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#9CA3AF' }}>
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
        <Lock size={11} style={{ color: '#D1D5DB' }} />
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#D1D5DB' }}>
          End-to-end encrypted · Nothing stored
        </span>
      </div>
    </div>
  );
}
