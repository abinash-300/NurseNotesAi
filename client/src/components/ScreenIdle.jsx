import React from 'react';
import { ChevronRight, Activity, Zap, Lock, Smartphone } from 'lucide-react';
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

const NOTE_LENGTH_OPTIONS = [
  { key: 'brief',    label: 'Brief'    },
  { key: 'standard', label: 'Standard' },
  { key: 'detailed', label: 'Detailed' },
];

function SectionHeader({ children }) {
  return (
    <div style={{ paddingLeft: 4, marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {children}
      </span>
    </div>
  );
}

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)   return 'Just now';
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function subjectivePreview(text) {
  if (!text) return 'No subjective data';
  const words = text.trim().split(/\s+/);
  return words.slice(0, 7).join(' ') + (words.length > 7 ? '…' : '');
}

export default function ScreenIdle({
  onStart, onDemo, sessions = [], onOpenSession,
  specialty = 'general', onSpecialtyChange,
  noteLength = 'standard', onNoteLengthChange,
}) {
  return (
    <div className="screen">
      <BrandRow state="idle" />

      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="flex flex-col gap-5 px-4 pt-5 pb-10">

          {/* ── Mic hero card ──────────────────────────────── */}
          {speechSupported ? (
            <div className="apple-card flex flex-col items-center gap-5 py-10 px-6">
              <MicCore onTap={onStart} size={140} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Press to begin
                </div>
                <div style={{ fontSize: 15, color: '#8E8E93', marginTop: 8, lineHeight: 1.55 }}>
                  Speak the patient report.<br />SOAP note generated in seconds.
                </div>
              </div>
            </div>
          ) : (
            <div className="apple-card flex flex-col items-center gap-5 py-10 px-6">
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,159,10,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={34} style={{ color: '#FF9F0A' }} strokeWidth={1.6} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#000000', letterSpacing: '-0.015em' }}>
                  Voice not available
                </div>
                <div style={{ fontSize: 15, color: '#8E8E93', marginTop: 8, lineHeight: 1.55 }}>
                  Safari doesn't support voice input.<br />
                  Open in <strong style={{ color: '#000000' }}>Chrome on Android</strong><br />
                  for full voice recording.
                </div>
              </div>
              <button className="btn-primary w-full" onClick={onDemo}>
                <Zap size={16} /> Try demo patient
              </button>
            </div>
          )}

          {/* ── Specialty ──────────────────────────────────── */}
          <div>
            <SectionHeader>Specialty</SectionHeader>
            <div className="apple-card px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => {
                  const active = specialty === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => onSpecialtyChange(s.key)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 99,
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        border: 'none',
                        background: active ? 'rgba(6,182,212,0.12)' : 'rgba(120,120,128,0.10)',
                        color: active ? '#06B6D4' : '#000000',
                        cursor: 'pointer',
                        transition: 'all 140ms ease',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Note Length ────────────────────────────────── */}
          <div>
            <SectionHeader>Note Length</SectionHeader>
            <div className="apple-card" style={{ padding: 6 }}>
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(120,120,128,0.12)',
                  borderRadius: 14,
                  padding: 3,
                }}
              >
                {NOTE_LENGTH_OPTIONS.map((opt) => {
                  const active = noteLength === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => onNoteLengthChange(opt.key)}
                      style={{
                        flex: 1,
                        padding: '9px 4px',
                        borderRadius: 11,
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        border: 'none',
                        background: active ? '#ffffff' : 'transparent',
                        color: active ? '#000000' : '#8E8E93',
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 140ms ease',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Load demo (list row) ────────────────────────── */}
          <div>
            <SectionHeader>Demo</SectionHeader>
            <div className="apple-card overflow-hidden">
              <button
                onClick={onDemo}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '14px 16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(6,182,212,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', flexShrink: 0 }}>
                    <Zap size={15} />
                  </div>
                  <span style={{ fontSize: 16, color: '#000000' }}>Load demo patient</span>
                </div>
                <ChevronRight size={16} style={{ color: '#C7C7CC' }} />
              </button>
            </div>
          </div>

          {/* ── Recent Notes ───────────────────────────────── */}
          <div>
            <SectionHeader>Recent Notes</SectionHeader>
            <div className="apple-card overflow-hidden">
              {sessions.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 16px' }}>
                  <Activity size={22} style={{ color: '#C7C7CC' }} />
                  <span style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
                    Your notes appear here
                  </span>
                  <span style={{ fontSize: 11, color: '#C7C7CC', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Notes are kept for this session only
                  </span>
                </div>
              ) : (
                sessions.map((session, i) => (
                  <div key={session.id}>
                    <button
                      onClick={() => onOpenSession(session)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '13px 16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent', textAlign: 'left',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {subjectivePreview(session.soap.subjective)}
                        </div>
                        <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 2 }}>
                          #{session.id} · {timeAgo(session.meta.createdAt)} · {session.meta.wordsOut}w
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: '#C7C7CC', flexShrink: 0, marginLeft: 12 }} />
                    </button>
                    {i < sessions.length - 1 && <div className="list-sep" />}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Privacy footer ─────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Lock size={10} style={{ color: '#C7C7CC' }} />
            <span style={{ fontSize: 11, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              End-to-end encrypted · Nothing stored
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
