import React from 'react';
import { ArrowLeft, Mic, Cpu, FileText, Shield, Mail } from 'lucide-react';

const HOW_STEPS = [
  {
    Icon: Mic,
    color: '#EF4444', bg: 'rgba(239,68,68,0.10)',
    title: 'Record',
    desc: 'Speak your patient handoff naturally — no special format required.',
  },
  {
    Icon: Cpu,
    color: '#06B6D4', bg: 'rgba(6,182,212,0.10)',
    title: 'Process',
    desc: "Groq's fast AI converts your words into a structured SOAP note in seconds.",
  },
  {
    Icon: FileText,
    color: '#a855f7', bg: 'rgba(168,85,247,0.10)',
    title: 'Document',
    desc: 'Review, edit, flag sections, and copy the note directly into your EHR.',
  },
];

export default function ScreenAbout({ onBack }) {
  return (
    <div className="screen">
      {/* Nav bar */}
      <div
        style={{
          background: '#ffffff', borderBottom: '0.5px solid #C6C6C8',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <button className="btn-icon" onClick={onBack} aria-label="Back">
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#000000', marginRight: 36 }}>
          About
        </div>
      </div>

      <div
        className="scroll-thin"
        style={{
          flex: 1, overflowY: 'auto',
          padding: '28px 16px 32px',
          display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center',
        }}
      >

        {/* Logo + wordmark */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #06B6D4, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(6,182,212,0.28)',
            }}
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#000000', letterSpacing: '-0.015em' }}>
            NurseNote AI
          </div>
          <div style={{ fontSize: 14, color: '#8E8E93', marginTop: 4 }}>
            Built for nurses, by people who care.
          </div>
          <div style={{ fontSize: 12, color: '#C7C7CC', marginTop: 6 }}>v1.0.0</div>
        </div>

        {/* How it works */}
        <div style={{ width: '100%' }}>
          <div className="section-header" style={{ marginBottom: 12 }}>How it works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HOW_STEPS.map(({ Icon, color, bg, title, desc }) => (
              <div key={title} className="apple-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ width: '100%' }}>
          <div className="section-header" style={{ marginBottom: 12 }}>Privacy</div>
          <div className="apple-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <Shield size={18} style={{ color: '#34C759', flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
              <p style={{ margin: 0, fontSize: 14, color: '#000000', lineHeight: 1.55 }}>
                NurseNote AI processes speech on-device using the Web Speech API. Your audio is never recorded or stored. The transcript is sent to Groq's API over HTTPS for note generation and is not retained after the response.
              </p>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#8E8E93', lineHeight: 1.5 }}>
              No account required. No data stored on our servers. Your session clears automatically after 5 minutes.
            </p>
          </div>
        </div>

        {/* Contact */}
        <a
          href="mailto:support@nursenoteai.app"
          style={{ fontSize: 14, color: '#06B6D4', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <Mail size={14} aria-hidden="true" />
          Contact Support
        </a>

      </div>
    </div>
  );
}
