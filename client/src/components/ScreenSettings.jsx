import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Trash2, Check } from 'lucide-react';

const SPECIALTIES = [
  { key: 'general',    label: 'General'    },
  { key: 'icu',        label: 'ICU'        },
  { key: 'er',         label: 'ER'         },
  { key: 'medsurg',    label: 'Med-Surg'   },
  { key: 'pediatrics', label: 'Pediatrics' },
  { key: 'cardiac',    label: 'Cardiac'    },
];

const NOTE_LENGTHS = [
  { key: 'brief',    label: 'Brief'    },
  { key: 'standard', label: 'Standard' },
  { key: 'detailed', label: 'Detailed' },
];

export default function ScreenSettings({ specialty, noteLength, onSpecialtyChange, onNoteLengthChange, onBack, showToast }) {
  const [apiKey,   setApiKey]   = useState(() => localStorage.getItem('nursenote_groq_key_override') ?? '');
  const [showKey,  setShowKey]  = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('nursenote_groq_key_override', apiKey.trim());
    } else {
      localStorage.removeItem('nursenote_groq_key_override');
    }
    setKeySaved(true);
    showToast?.('API key saved');
    setTimeout(() => setKeySaved(false), 2000);
  };

  const clearAll = () => {
    if (!window.confirm('Clear all app data? This cannot be undone.')) return;
    localStorage.clear();
    window.location.reload();
  };

  const pillarStyle = (active) => ({
    padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500,
    background: active ? '#06B6D4' : '#ffffff',
    color:      active ? '#ffffff' : '#000000',
    border:     active ? 'none'    : '1px solid #C6C6C8',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 8px rgba(6,182,212,0.30)' : '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'all 150ms ease',
  });

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
        <button className="btn-icon" onClick={onBack} aria-label="Back to home">
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#000000', marginRight: 36 }}>
          Settings
        </div>
      </div>

      <div
        className="scroll-thin"
        style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}
      >

        {/* Default Specialty */}
        <section aria-labelledby="settings-specialty">
          <div id="settings-specialty" className="section-header" style={{ marginBottom: 10 }}>Default Specialty</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SPECIALTIES.map((s) => (
              <button
                key={s.key}
                onClick={() => onSpecialtyChange(s.key)}
                className="tap-scale"
                aria-pressed={specialty === s.key}
                style={pillarStyle(specialty === s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Default Note Length */}
        <section aria-labelledby="settings-length">
          <div id="settings-length" className="section-header" style={{ marginBottom: 10 }}>Default Note Length</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {NOTE_LENGTHS.map((n) => (
              <button
                key={n.key}
                onClick={() => onNoteLengthChange(n.key)}
                className="tap-scale"
                aria-pressed={noteLength === n.key}
                style={{ ...pillarStyle(noteLength === n.key), flex: 1, padding: '10px 8px' }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </section>

        {/* Groq API Key */}
        <section aria-labelledby="settings-apikey">
          <div id="settings-apikey" className="section-header" style={{ marginBottom: 4 }}>Groq API Key</div>
          <p style={{ fontSize: 12, color: '#8E8E93', margin: '0 0 10px' }}>
            Override the built-in key. Get yours free at console.groq.com.
          </p>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              aria-label="Groq API key"
              autoComplete="off"
              spellCheck={false}
              style={{
                display: 'block', width: '100%', padding: '12px 44px 12px 14px',
                borderRadius: 12, fontSize: 14,
                fontFamily: "'SF Mono', 'DM Mono', ui-monospace, monospace",
                background: '#ffffff', border: '1px solid #C6C6C8',
                color: '#000000', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#8E8E93',
                display: 'flex', alignItems: 'center',
              }}
            >
              {showKey ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
          <button
            onClick={saveKey}
            className="btn-primary tap-scale"
            style={{ width: '100%', marginTop: 10, padding: '12px', fontSize: 14, borderRadius: 12 }}
          >
            {keySaved ? <><Check size={14} aria-hidden="true" /> Saved</> : 'Save Key'}
          </button>
        </section>

        {/* Data management */}
        <section aria-labelledby="settings-data">
          <div id="settings-data" className="section-header" style={{ marginBottom: 10 }}>Data</div>
          <div className="apple-card" style={{ overflow: 'hidden' }}>
            <button
              onClick={clearAll}
              className="tap-scale"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                width: '100%', padding: '15px 16px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,59,48,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trash2 size={18} style={{ color: '#FF3B30' }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#FF3B30' }}>Clear All Data</div>
                <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>Removes settings, history, and API key</div>
              </div>
            </button>
          </div>
        </section>

        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#C7C7CC' }}>NurseNote AI v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
