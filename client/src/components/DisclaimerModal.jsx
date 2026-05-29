import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

const OVERLAY = {
  position: 'fixed', inset: 0, zIndex: 50,
  background: 'rgba(0,0,0,0.40)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px 16px',
};

const CARD = {
  background: '#ffffff',
  border: '1px solid #D1D5DB',
  borderRadius: 20,
  padding: '28px 24px 24px',
  maxWidth: 420,
  width: '100%',
  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
};

function LearnMoreScreen({ onBack, onAccept }) {
  return (
    <div style={{ ...OVERLAY, alignItems: 'stretch', padding: 0 }}>
      <div
        style={{
          flex: 1, background: '#ffffff',
          display: 'flex', flexDirection: 'column',
          maxWidth: 560, margin: '0 auto', width: '100%',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5"
          style={{
            paddingTop: 'calc(18px + env(safe-area-inset-top))',
            paddingBottom: 16,
            borderBottom: '1px solid #D1D5DB',
          }}
        >
          <button className="btn-icon" onClick={onBack} aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>About NurseNote AI</span>
            <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', color: '#9CA3AF' }}>
              FULL DISCLAIMER
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 scroll-thin overflow-y-auto px-5 py-5 flex flex-col gap-5"
          style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
        >
          {[
            {
              title: 'Documentation assistant only',
              body: 'NurseNote AI converts verbal nursing reports into structured SOAP notes. It is a documentation aid and does not provide medical advice, diagnosis, or treatment recommendations.',
            },
            {
              title: 'AI limitations',
              body: 'Language models can produce errors, omissions, or misinterpretations of clinical information. Every generated note must be reviewed and verified by the responsible clinician before use in any official capacity or entry into an EHR.',
            },
            {
              title: 'Does not replace clinical judgment',
              body: 'This tool does not replace the professional knowledge, training, or clinical judgment of qualified healthcare providers. Always apply your own expertise when reviewing generated output.',
            },
            {
              title: 'Data privacy',
              body: 'No audio, transcripts, or notes are stored on any server. All session data exists only in your browser and is permanently cleared when you close or refresh the page.',
            },
            {
              title: 'Regulatory notice',
              body: "NurseNote AI is not FDA-cleared or CE-marked as a medical device. Use is subject to applicable laws and your institution's policies governing clinical documentation software.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-1.5">
              <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>{title}</span>
              <p className="m-0" style={{ fontSize: 13, lineHeight: 1.65, color: '#6B7280' }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="px-5 flex flex-col gap-2.5"
          style={{
            paddingTop: 16,
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            borderTop: '1px solid #D1D5DB',
          }}
        >
          <button
            className="btn-primary w-full"
            onClick={onAccept}
            style={{ padding: '15px 20px', borderRadius: 14, fontSize: 14 }}
          >
            <ShieldCheck size={16} />
            I understand — continue
          </button>
          <button
            className="btn-ghost w-full"
            onClick={onBack}
            style={{ padding: '11px 20px', borderRadius: 14, fontSize: 13 }}
          >
            Back to disclaimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DisclaimerModal({ onAccept }) {
  const [learnMore, setLearnMore] = useState(false);

  if (learnMore) {
    return <LearnMoreScreen onBack={() => setLearnMore(false)} onAccept={onAccept} />;
  }

  return (
    /* Overlay — no onClick so tapping outside does nothing */
    <div style={OVERLAY}>
      <div style={CARD}>
        {/* Icon + title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f97316',
            }}
          >
            <AlertTriangle size={18} strokeWidth={1.8} />
          </div>
          <div className="flex flex-col" style={{ lineHeight: 1.2, paddingTop: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
              Clinical Use Disclaimer
            </span>
            <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', marginTop: 3, color: '#9CA3AF' }}>
              READ BEFORE CONTINUING
            </span>
          </div>
        </div>

        {/* Body */}
        <p
          className="m-0"
          style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 24, color: '#374151' }}
        >
          NurseNote AI assists with documentation only. Always verify the accuracy of generated
          notes before clinical use. This tool does not replace clinical judgment.
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: '#D1D5DB', marginBottom: 20 }} />

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            className="btn-primary w-full"
            onClick={onAccept}
            style={{ padding: '14px 20px', borderRadius: 12, fontSize: 14 }}
          >
            <ShieldCheck size={16} />
            I understand
          </button>
          <button
            className="btn-ghost w-full"
            onClick={() => setLearnMore(true)}
            style={{ padding: '11px 20px', borderRadius: 12, fontSize: 13 }}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
