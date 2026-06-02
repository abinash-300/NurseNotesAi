import React, { useState, useEffect, useRef } from 'react';
import { Square } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';
import Waveform from './Waveform.jsx';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };

function fmtTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function ScreenRecording({ transcript, setTranscript, onStop, onCancel, showToast }) {
  const [seconds,   setSeconds]   = useState(0);
  const [interim,   setInterim]   = useState('');
  const [recError,  setRecError]  = useState('');
  const recognitionRef    = useRef(null);
  const shouldContinueRef = useRef(false);
  const startedAtRef      = useRef(Date.now());

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setRecError('Voice not supported. On iPhone use Chrome; on desktop use Chrome or Edge.');
      return;
    }
    const r = new SR();
    r.continuous     = true;
    r.interimResults = true;
    r.lang           = 'en-US';

    r.onresult = (event) => {
      let finalText = '', interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript + ' ';
        else                          interimText += event.results[i][0].transcript;
      }
      if (finalText) setTranscript((prev) => prev + finalText);
      setInterim(interimText);
    };
    r.onend   = () => { if (shouldContinueRef.current) { try { r.start(); } catch {} } };
    r.onerror = (e) => {
      if (e.error !== 'aborted') {
        setRecError(`Recognition error: ${e.error}`);
        shouldContinueRef.current = false;
      }
    };

    shouldContinueRef.current = true;
    recognitionRef.current    = r;
    try { r.start(); } catch {}

    return () => {
      shouldContinueRef.current = false;
      try { r.stop(); } catch {}
    };
  }, []);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const t = setInterval(
      () => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)),
      250,
    );
    return () => clearInterval(t);
  }, []);

  const fullText  = (transcript || '') + (interim ? ' ' + interim : '');
  const lines     = fullText.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;

  const handleStop = () => {
    if (wordCount === 0 && !recError) {
      showToast?.('No speech detected. Try again or use the demo patient button.');
      return;
    }
    vibrate([50, 50, 50]);
    shouldContinueRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    onStop();
  };

  return (
    <div className="screen">
      <BrandRow state="recording" />

      <div className="flex-1 flex flex-col items-center px-4 pt-5 gap-4 overflow-y-auto scroll-thin">

        {/* Timer */}
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            {fmtTime(seconds)}
          </div>
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                color: recError ? '#FF3B30' : '#8E8E93',
              }}
            >
              {recError ? 'Voice unavailable' : 'Recording — tap orb to stop'}
            </span>
          </div>
        </div>

        {/* Orb */}
        <MicCore recording onTap={handleStop} size={110} />

        {/* Waveform */}
        <Waveform active={!recError} count={44} color="#C6C6C8" height={44} />

        {/* Live transcript card */}
        <div className="apple-card w-full" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Transcript
            </span>
            <span style={{ fontSize: 12, color: '#8E8E93' }}>
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ minHeight: 180, position: 'relative', overflow: 'hidden' }}>
            {recError ? (
              <p style={{ margin: 0, fontSize: 14, color: '#FF3B30', lineHeight: 1.55 }}>{recError}</p>
            ) : lines.length === 0 ? (
              <p style={{ margin: 0, fontSize: 14, color: '#8E8E93', lineHeight: 1.55, fontStyle: 'italic' }}>
                Listening… start speaking the patient report.
                <span style={{ color: '#06B6D4' }}> ▍</span>
              </p>
            ) : (
              <div>
                {lines.map((line, i) => (
                  <p key={i} style={{ margin: '0 0 5px', fontSize: 15, color: '#000000', lineHeight: 1.5 }}>
                    {line}
                    {i === lines.length - 1 && <span style={{ color: '#06B6D4' }}> ▍</span>}
                  </p>
                ))}
              </div>
            )}
            <div
              style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 28,
                background: 'linear-gradient(transparent, #ffffff)',
                pointerEvents: 'none',
                borderRadius: '0 0 20px 20px',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 'auto', paddingBottom: 8 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleStop}>
            <Square size={14} />
            Stop &amp; generate
          </button>
        </div>

      </div>

      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <span style={{ fontSize: 11, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          End-to-end encrypted · Nothing stored
        </span>
      </div>
    </div>
  );
}
