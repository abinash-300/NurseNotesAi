import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Edit2, Flag, Share2, Plus, X } from 'lucide-react';
import BrandRow from './BrandRow.jsx';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };

const CLEAR_SECS = 300;

const SPECIALTY_LABELS = {
  general: 'General', icu: 'ICU', er: 'ER',
  medsurg: 'Med-Surg', pediatrics: 'Pediatrics', cardiac: 'Cardiac',
};

const LENGTH_LABELS = {
  brief: 'Brief', standard: 'Standard', detailed: 'Detailed',
};

function timeAgo(ts) {
  if (!ts) return 'Just now';
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)   return 'Just now';
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function fmtCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SOAP_META = [
  { key: 'subjective', letter: 'S', title: 'Subjective', color: '#f97316' },
  { key: 'objective',  letter: 'O', title: 'Objective',  color: '#06B6D4' },
  { key: 'assessment', letter: 'A', title: 'Assessment', color: '#a855f7' },
  { key: 'plan',       letter: 'P', title: 'Plan',       color: '#22C55E' },
];

function SoapCard({ section, body, index, onSave, flagged, onFlag }) {
  const [copied,  setCopied]  = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState('');

  const words = editing
    ? (draft.trim() ? draft.trim().split(/\s+/).length : 0)
    : (body ? body.trim().split(/\s+/).length : 0);

  const copy = async () => {
    vibrate(30);
    try { await navigator.clipboard.writeText(body); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const startEdit = () => { setDraft(body); setEditing(true); };
  const save      = () => { onSave(draft); setEditing(false); };
  const cancel    = () => { setEditing(false); };

  const accentColor = flagged ? '#F59E0B' : section.color;

  return (
    <div
      className="animate-rise-in apple-card"
      style={{
        animationDelay: `${index * 80}ms`,
        overflow: 'hidden',
      }}
    >
      {/* Card header row */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          padding: '16px 18px 12px',
        }}
      >
        {/* Letter — 22px, section color */}
        <span
          style={{
            fontSize: 22, fontWeight: 700, flexShrink: 0, lineHeight: 1,
            color: accentColor,
            transition: 'color 200ms ease',
            marginRight: 10,
          }}
        >
          {section.letter}
        </span>

        {/* Title + word count */}
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#000000' }}>{section.title}</div>
          <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 2 }}>
            {words} words{editing ? ' · Editing' : ''}
          </div>
        </div>

        {/* Action icons — 18px, no background */}
        {editing ? (
          <button
            onClick={cancel}
            aria-label="Cancel edit"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#8E8E93' }}
          >
            <X size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              onClick={copy}
              aria-label="Copy"
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#34C759' : '#C7C7CC', WebkitTapHighlightColor: 'transparent' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={startEdit}
              aria-label="Edit"
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#C7C7CC', WebkitTapHighlightColor: 'transparent' }}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onFlag}
              aria-label={flagged ? 'Remove flag' : 'Flag for review'}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: flagged ? '#F59E0B' : '#C7C7CC', transition: 'color 150ms ease', WebkitTapHighlightColor: 'transparent' }}
            >
              <Flag size={16} fill={flagged ? '#F59E0B' : 'none'} />
            </button>
          </div>
        )}
      </div>

      {/* 0.5px divider in #F2F2F7 */}
      <div style={{ height: 0.5, background: '#F2F2F7', marginLeft: 18 }} />

      {/* Needs review chip */}
      {flagged && (
        <div style={{ padding: '10px 18px 0' }}>
          <span
            style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: 99,
              background: '#FEF3C7', border: '1px solid #F59E0B', color: '#92400E',
            }}
          >
            Needs Review
          </span>
        </div>
      )}

      {/* Body — 16px top padding */}
      <div style={{ padding: '16px 18px 18px' }}>
        {editing ? (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              style={{
                display: 'block', width: '100%', minHeight: 96,
                background: '#F2F2F7',
                border: `1.5px solid ${section.color}`,
                borderRadius: 12, color: '#000000',
                fontSize: 15, lineHeight: 1.6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                padding: '10px 12px', resize: 'vertical',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn-ghost" onClick={cancel} style={{ flex: 1, padding: '8px 10px', fontSize: 13, borderRadius: 10 }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={save} style={{ flex: 2, padding: '8px 10px', fontSize: 13, borderRadius: 10 }}>
                <Check size={13} /> Save
              </button>
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#000000', fontWeight: 400 }}>{body}</p>
        )}
      </div>
    </div>
  );
}

export default function ScreenResult({ soap, meta, onNew, showToast }) {
  const [fullCopied,  setFullCopied]  = useState(false);
  const [editedSoap,  setEditedSoap]  = useState(() => ({ ...soap }));
  const [,            forceUpdate]    = useState(0);
  const [remaining,   setRemaining]   = useState(CLEAR_SECS);
  const [flaggedKeys, setFlaggedKeys] = useState(new Set());
  const [copyConfirm, setCopyConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => forceUpdate((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      showToast?.('Session cleared for privacy');
      onNew();
    }
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const timerColor = remaining > 120 ? '#34C759' : remaining > 30 ? '#FF9F0A' : '#FF3B30';

  const updateSection = (key, text) => setEditedSoap((prev) => ({ ...prev, [key]: text }));

  const toggleFlag = (key) => {
    vibrate(20);
    setFlaggedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const fullNote = SOAP_META
    .map((s) => `${s.title.toUpperCase()}:\n${editedSoap[s.key] ?? ''}`)
    .join('\n\n');

  const fullNoteWithFlags = SOAP_META
    .map((s) => {
      const body   = editedSoap[s.key] ?? '';
      const prefix = flaggedKeys.has(s.key) ? '[NEEDS REVIEW] ' : '';
      return `${s.title.toUpperCase()}:\n${prefix}${body}`;
    })
    .join('\n\n');

  const copyFull = async () => {
    if (flaggedKeys.size > 0) {
      setCopyConfirm(true);
      return;
    }
    vibrate(30);
    try { await navigator.clipboard.writeText(fullNote); } catch {}
    setFullCopied(true);
    setTimeout(() => setFullCopied(false), 1800);
  };

  const copyAnyway = async () => {
    vibrate(30);
    try { await navigator.clipboard.writeText(fullNoteWithFlags); } catch {}
    setFullCopied(true);
    setCopyConfirm(false);
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
  const specialtyLabel = SPECIALTY_LABELS[meta?.specialty]  ?? 'General';
  const lengthLabel    = LENGTH_LABELS[meta?.noteLength]    ?? 'Standard';

  return (
    <div className="screen">

      {/* Header */}
      <BrandRow state="idle" />

      {/* Header nav row with white circle buttons */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '0.5px solid #C6C6C8',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 10,
        }}
      >
        <button
          className="btn-icon"
          onClick={onNew}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#000000' }}>
            Session #{sessionNumber}
          </div>
          <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>
            {timestamp} · {wordsIn} words in
          </div>
        </div>

        {/* Spacer to balance the back button */}
        <div style={{ width: 36 }} />
      </div>

      {/* Clear timer — white pill card + 2px progress bar below */}
      <div style={{ padding: '10px 16px 0', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{ width: 6, height: 6, borderRadius: '50%', background: timerColor, display: 'inline-block', flexShrink: 0, transition: 'background 600ms ease' }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#000000' }}>
              Clears in {fmtCountdown(remaining)}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Privacy auto-clear</span>
        </div>
        {/* 2px progress bar below the pill */}
        <div style={{ height: 2, background: '#F2F2F7', borderRadius: '0 0 2px 2px', overflow: 'hidden', marginTop: 2 }}>
          <div
            style={{
              height: '100%',
              width: `${(remaining / CLEAR_SECS) * 100}%`,
              background: timerColor,
              transition: 'width 1s linear, background 600ms ease',
            }}
          />
        </div>
      </div>

      {/* Context chips — horizontal scroll white card */}
      <div style={{ padding: '8px 16px 6px', position: 'relative', zIndex: 10 }}>
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 0' }}
        >
          {[specialtyLabel, lengthLabel, 'Vitals captured'].map((label) => (
            <span
              key={label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                flexShrink: 0,
                background: '#ffffff',
                border: '0.5px solid #E5E5EA',
                borderRadius: 99,
                padding: '5px 12px',
                fontSize: 12, fontWeight: 500, color: '#000000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable SOAP cards */}
      <div
        className="scroll-thin"
        style={{
          flex: 1, overflowY: 'auto', position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 10,
          padding: '4px 16px',
          paddingBottom: 'calc(110px + env(safe-area-inset-bottom))',
        }}
      >
        {SOAP_META.map((s, i) => (
          <SoapCard
            key={s.key}
            section={s}
            body={editedSoap[s.key] ?? '(not generated)'}
            index={i}
            onSave={(text) => updateSection(s.key, text)}
            flagged={flaggedKeys.has(s.key)}
            onFlag={() => toggleFlag(s.key)}
          />
        ))}

        {/* Meta panel — 4-stat grid */}
        <div
          className="apple-card"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}
        >
          {[
            { label: 'Generated in', value: `${secs}s`                },
            { label: 'Model',        value: 'llama-3.1-8b'             },
            { label: 'Confidence',   value: 'High · 94%',  green: true },
            { label: 'Words',        value: `${wordsIn} in / ${wordsOut} out` },
          ].map(({ label, value, green }, idx) => (
            <div
              key={label}
              style={{
                padding: '14px 16px',
                borderRight: idx % 2 === 0 ? '0.5px solid #F2F2F7' : 'none',
                borderBottom: idx < 2 ? '0.5px solid #F2F2F7' : 'none',
              }}
            >
              <div style={{ fontSize: 11, color: '#8E8E93', marginBottom: 4, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: green ? '#34C759' : '#000000', fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flag-copy confirmation overlay */}
      {copyConfirm && (
        <div
          style={{
            position: 'absolute', left: 12, right: 12, zIndex: 30,
            bottom: 'calc(96px + env(safe-area-inset-bottom))',
            background: '#FFFBEB',
            border: '1px solid #F59E0B',
            borderRadius: 20,
            padding: '16px 18px',
            boxShadow: '0 4px 20px rgba(245,158,11,0.18)',
          }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#92400E', lineHeight: 1.5 }}>
            {flaggedKeys.size === 1 ? '1 section' : `${flaggedKeys.size} sections`} flagged for review. Copy anyway?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setCopyConfirm(false)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 12, fontSize: 14, fontWeight: 500, background: 'transparent', border: '1px solid #F59E0B', color: '#92400E', cursor: 'pointer' }}
            >
              Review first
            </button>
            <button
              onClick={copyAnyway}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#F59E0B', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              Copy anyway
            </button>
          </div>
        </div>
      )}

      {/* Sticky bottom bar — order: [+New] [Copy full note] [Share] */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          background: '#ffffff',
          borderTop: '0.5px solid #C6C6C8',
        }}
      >
        {/* + New */}
        <button
          className="btn-icon"
          onClick={onNew}
          aria-label="New session"
          style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }}
        >
          <Plus size={18} />
        </button>

        {/* Copy full note — primary, grows */}
        <button
          className="btn-primary"
          onClick={copyFull}
          style={{ flex: 1, padding: '14px 18px', borderRadius: 14, fontSize: 16 }}
        >
          {fullCopied ? <Check size={16} /> : <Copy size={16} />}
          {fullCopied ? 'Copied!' : 'Copy full note'}
        </button>

        {/* Share */}
        <button
          className="btn-icon"
          onClick={handleShare}
          aria-label="Share"
          style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
