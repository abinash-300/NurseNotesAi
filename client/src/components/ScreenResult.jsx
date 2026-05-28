import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Copy, Check, Edit2, Flag, Share2, Plus, X } from 'lucide-react';

const CLEAR_SECS = 300; // 5 minutes

const SPECIALTY_LABELS = {
  general: 'General', icu: 'ICU', er: 'ER',
  medsurg: 'Med-Surg', pediatrics: 'Pediatrics', cardiac: 'Cardiac',
};

function timeAgo(ts) {
  if (!ts) return 'JUST NOW';
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)   return 'JUST NOW';
  if (secs < 60)   return `${secs}S AGO`;
  if (secs < 3600) return `${Math.floor(secs / 60)} MIN AGO`;
  return `${Math.floor(secs / 3600)}H AGO`;
}

function fmtCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SOAP_META = [
  { key: 'subjective', letter: 'S', title: 'Subjective', color: '#fb923c' },
  { key: 'objective',  letter: 'O', title: 'Objective',  color: '#22d3ee' },
  { key: 'assessment', letter: 'A', title: 'Assessment', color: '#c084fc' },
  { key: 'plan',       letter: 'P', title: 'Plan',       color: '#34d399' },
];

function SoapRing({ letter, color }) {
  return (
    <div
      className="font-mono flex items-center justify-center flex-shrink-0"
      style={{
        width: 44, height: 44, borderRadius: '50%',
        fontSize: 20, fontWeight: 500, color,
        background: `radial-gradient(circle at 50% 30%, ${color}33 0%, transparent 70%)`,
        border: `1px solid ${color}55`,
        boxShadow: `0 0 0 1px ${color}22, 0 0 16px ${color}22`,
      }}
    >
      {letter}
    </div>
  );
}

function SoapCard({ section, body, index, onSave }) {
  const [copied,  setCopied]  = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState('');

  const words = editing
    ? (draft.trim() ? draft.trim().split(/\s+/).length : 0)
    : (body ? body.trim().split(/\s+/).length : 0);

  const copy = async () => {
    try { await navigator.clipboard.writeText(body); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const startEdit = () => { setDraft(body); setEditing(true); };
  const save      = () => { onSave(draft); setEditing(false); };
  const cancel    = () => { setEditing(false); };

  return (
    <div
      className="card-glass animate-rise-in"
      style={{ padding: '14px 16px', animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-3">
          <SoapRing letter={section.letter} color={section.color} />
          <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
            <span className="text-ink-1 font-semibold" style={{ fontSize: 15 }}>{section.title}</span>
            <span className="font-mono text-ink-4" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
              {words} WORDS{editing ? ' · EDITING' : ''}
            </span>
          </div>
        </div>

        {editing ? (
          <button className="btn-icon" onClick={cancel} aria-label="Cancel edit"><X size={14} /></button>
        ) : (
          <div className="flex gap-1">
            <button className="btn-icon" onClick={copy} aria-label="Copy">
              {copied ? <Check size={14} style={{ color: '#6ee7b7' }} /> : <Copy size={14} />}
            </button>
            <button className="btn-icon" onClick={startEdit} aria-label="Edit" style={{ color: '#c8d3ed' }}>
              <Edit2 size={14} />
            </button>
            <button className="btn-icon" aria-label="Flag"><Flag size={14} /></button>
          </div>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            style={{
              display: 'block', width: '100%', minHeight: 96,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${section.color}44`,
              borderRadius: 8, color: '#c8d3ed',
              fontSize: 13.5, lineHeight: 1.6,
              fontFamily: 'Sora, system-ui, sans-serif',
              padding: '9px 11px', resize: 'vertical',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div className="flex gap-2 mt-2.5">
            <button className="btn-ghost" onClick={cancel}
              style={{ flex: 1, padding: '7px 10px', fontSize: 12, borderRadius: 8 }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={save}
              style={{ flex: 2, padding: '7px 10px', fontSize: 12, borderRadius: 8 }}>
              <Check size={13} /> Save
            </button>
          </div>
        </>
      ) : (
        <p className="m-0 text-ink-2" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{body}</p>
      )}
    </div>
  );
}

export default function ScreenResult({ soap, meta, onNew, showToast }) {
  const [fullCopied, setFullCopied] = useState(false);
  const [editedSoap, setEditedSoap] = useState(() => ({ ...soap }));
  const [, forceUpdate]             = useState(0);
  const [remaining,  setRemaining]  = useState(CLEAR_SECS);

  // Re-render every 15s so the "X mins ago" timestamp stays fresh
  useEffect(() => {
    const t = setInterval(() => forceUpdate((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  // Countdown — cancels automatically if user navigates away (cleanup)
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Fire when countdown reaches zero
  useEffect(() => {
    if (remaining === 0) {
      showToast?.('Session cleared for privacy');
      onNew();
    }
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const timerColor = remaining > 120 ? '#34d399' : remaining > 30 ? '#fbbf24' : '#f87171';

  const updateSection = (key, text) => setEditedSoap((prev) => ({ ...prev, [key]: text }));

  const fullNote = SOAP_META
    .map((s) => `${s.title.toUpperCase()}:\n${editedSoap[s.key] ?? ''}`)
    .join('\n\n');

  const copyFull = async () => {
    try { await navigator.clipboard.writeText(fullNote); } catch {}
    setFullCopied(true);
    setTimeout(() => setFullCopied(false), 1800);
  };

  const handleShare = async () => {
    const title = `NurseNote AI — Session #${sessionNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: fullNote });
      } catch (err) {
        if (err.name !== 'AbortError') showToast?.('Share failed. Try the copy button instead.');
      }
    } else {
      try { await navigator.clipboard.writeText(fullNote); } catch {}
      showToast?.('Copied to clipboard');
    }
  };

  const secs           = ((meta?.ms ?? 0) / 1000).toFixed(2);
  const wordsIn        = meta?.wordsIn       ?? 0;
  const wordsOut       = meta?.wordsOut      ?? 0;
  const sessionNumber  = meta?.sessionNumber ?? '—';
  const timestamp      = timeAgo(meta?.createdAt);
  const specialtyLabel = SPECIALTY_LABELS[meta?.specialty] ?? 'General';

  return (
    <div className="screen">
      {/* Draining progress bar — absolute at the very top */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 30,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(remaining / CLEAR_SECS) * 100}%`,
            background: timerColor,
            boxShadow: `0 0 6px ${timerColor}99`,
            transition: 'width 1s linear, background-color 600ms ease, box-shadow 600ms ease',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3.5 pb-1.5">
        <button className="btn-icon" onClick={onNew} aria-label="New session">
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col items-center" style={{ lineHeight: 1.15 }}>
          <span className="text-ink-1 font-semibold" style={{ fontSize: 13.5 }}>
            Session #{sessionNumber}
          </span>
          <span className="font-mono text-ink-4" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
            {timestamp} · {wordsIn} WORDS IN
          </span>
        </div>
        <button className="btn-icon" aria-label="More"><MoreHorizontal size={16} /></button>
      </div>

      {/* Auto-clear countdown chip */}
      <div className="relative z-10 flex justify-center px-4 pb-1">
        <span
          className="font-mono flex items-center gap-1.5"
          style={{
            fontSize: 10, letterSpacing: '0.06em',
            padding: '4px 10px', borderRadius: 99,
            color: timerColor,
            background: `${timerColor}14`,
            border: `1px solid ${timerColor}38`,
            transition: 'color 600ms ease, background 600ms ease, border-color 600ms ease',
          }}
        >
          <span
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: timerColor,
              display: 'inline-block',
              flexShrink: 0,
              transition: 'background 600ms ease',
            }}
          />
          Clears in {fmtCountdown(remaining)}
        </span>
      </div>

      {/* Context chips */}
      <div className="relative z-10 flex gap-1.5 flex-wrap px-4 pb-2">
        <span className="chip">68 M</span>
        <span
          className="chip"
          style={{
            background: 'rgba(34,211,238,0.08)',
            border: '1px solid rgba(34,211,238,0.30)',
            color: '#22d3ee',
          }}
        >
          {specialtyLabel}
        </span>
        <span className="chip">2h ago</span>
        <span className="chip chip-ok"><span className="dot" />Vitals captured</span>
      </div>

      {/* Scrollable SOAP cards */}
      <div
        className="relative z-10 flex-1 overflow-y-auto scroll-thin flex flex-col gap-2.5 px-3.5 pt-2"
        style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}
      >
        {SOAP_META.map((s, i) => (
          <SoapCard
            key={s.key}
            section={s}
            body={editedSoap[s.key] ?? '(not generated)'}
            index={i}
            onSave={(text) => updateSection(s.key, text)}
          />
        ))}

        {/* Meta panel */}
        <div
          className="mt-1.5 rounded-[14px] grid grid-cols-2 gap-2.5 p-3.5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--navy-border)' }}
        >
          {[
            { label: 'GENERATED IN',   value: `${secs}s`               },
            { label: 'MODEL',          value: 'llama-3.1-8b'            },
            { label: 'CONFIDENCE',     value: 'HIGH · 94%', green: true },
            { label: 'WORDS IN / OUT', value: `${wordsIn} / ${wordsOut}` },
          ].map(({ label, value, green }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="eyebrow" style={{ fontSize: 9 }}>{label}</span>
              <span className="font-mono tabular-nums"
                style={{ fontSize: 13, color: green ? '#6ee7b7' : '#f4f7ff' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 flex items-center gap-2 px-4 pt-3.5"
        style={{
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg, transparent, #050a1a 30%)',
        }}
      >
        <button className="btn-icon" onClick={handleShare} aria-label="Share note"
          style={{ width: 48, height: 48, borderRadius: 14 }}>
          <Share2 size={18} />
        </button>
        <button className="btn-primary flex-1" onClick={copyFull}
          style={{ padding: '14px 18px', borderRadius: 14 }}>
          {fullCopied ? <Check size={16} /> : <Copy size={16} />}
          {fullCopied ? 'Copied!' : 'Copy full note'}
        </button>
        <button className="btn-icon" onClick={onNew} aria-label="New session"
          style={{ width: 48, height: 48, borderRadius: 14 }}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
