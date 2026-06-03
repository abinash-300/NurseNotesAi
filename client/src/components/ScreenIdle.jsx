import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Activity, Smartphone, Lock } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import ProfileSheet from './ProfileSheet.jsx';
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
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
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
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const scrollRef     = useRef(null);
  const largeTitleRef = useRef(null);

  /* Large-title scroll detection via IntersectionObserver */
  useEffect(() => {
    const sentinel = largeTitleRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="screen">
      <BrandRow state="idle" onProfile={() => setShowProfile(true)} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin">
        <div className="flex flex-col gap-5 px-4 pb-12">

          {/* ── Large navigation title ──────────────────────── */}
          <div ref={largeTitleRef} style={{ paddingTop: 20, transition: 'all 200ms ease', opacity: scrolled ? 0.5 : 1 }}>
            <div
              style={{
                fontSize: scrolled ? 18 : 34,
                fontWeight: 800,
                color: '#000000',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                transition: 'font-size 200ms ease',
              }}
            >
              NurseNote
            </div>
            {!scrolled && (
              <div style={{ fontSize: 14, color: '#8E8E93', marginTop: 5, transition: 'opacity 200ms ease' }}>
                Voice-to-SOAP in seconds
              </div>
            )}
          </div>

          {/* ── Mic hero ───────────────────────────────────── */}
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
                Try demo patient
              </button>
            </div>
          )}

          {/* ── Specialty ──────────────────────────────────── */}
          <div>
            <SectionHeader>Specialty</SectionHeader>
            <div className="apple-card" style={{ padding: '14px 16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="no-scrollbar"
                  style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingRight: 32 }}
                >
                  {SPECIALTIES.map((s) => {
                    const active = specialty === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => onSpecialtyChange(s.key)}
                        className="tap-scale"
                        style={{
                          height: 34,
                          padding: '0 16px',
                          borderRadius: 99,
                          fontSize: 13,
                          fontWeight: active ? 600 : 400,
                          border: 'none',
                          flexShrink: 0,
                          background: active ? '#06B6D4' : '#F2F2F7',
                          color: active ? '#FFFFFF' : '#8E8E93',
                          boxShadow: active ? '0 2px 8px rgba(6,182,212,0.30)' : 'none',
                          cursor: 'pointer',
                          transition: 'background 140ms ease, color 140ms ease, box-shadow 140ms ease',
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                {/* Right-edge fade */}
                <div
                  style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, width: 32,
                    background: 'linear-gradient(to right, transparent, #ffffff)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Note Length ────────────────────────────────── */}
          <div>
            <SectionHeader>Note Length</SectionHeader>
            <div className="apple-card" style={{ padding: '14px 16px' }}>
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
                      className="tap-scale"
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
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
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
                      className="tap-scale"
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

      {/* Profile bottom sheet */}
      {showProfile && (
        <ProfileSheet
          onDemo={onDemo}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
