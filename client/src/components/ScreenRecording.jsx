import React, { useState, useEffect, useRef } from 'react';
import { Square, Pause } from 'lucide-react';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';
import Waveform from './Waveform.jsx';

function fmtTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function ScreenRecording({ transcript, setTranscript, onStop, onCancel, showToast }) {
  const [seconds,   setSeconds]   = useState(0);
  const [interim,   setInterim]   = useState('');
  const [recError,  setRecError]  = useState('');
  const recognitionRef   = useRef(null);
  const shouldContinueRef = useRef(false);
  const startedAtRef      = useRef(Date.now());

  // Start recognition on mount, stop on unmount
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setRecError('Voice not supported. On iPhone use Chrome; on desktop use Chrome or Edge.');
      return;
    }
    const r = new SR();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = 'en-US';

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

  // Timer
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

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-3 gap-[18px]">
        {/* Timer */}
        <div className="text-center flex flex-col gap-1">
          <span
            className="font-sans font-semibold tabular-nums"
            style={{ fontSize: 52, letterSpacing: '-0.02em', color: '#111827', lineHeight: 1 }}
          >
            {fmtTime(seconds)}
          </span>
          <span className="eyebrow eyebrow-red flex items-center justify-center gap-1.5">
            <span
              className="dot animate-pulse-dot"
              style={{ background: '#f87171', boxShadow: '0 0 8px #f87171' }}
            />
            {recError ? 'Voice unavailable' : 'Recording — tap stop when done'}
          </span>
        </div>

        <MicCore recording onTap={handleStop} size={110} />
        <Waveform active={!recError} count={42} color="#06B6D4" height={48} />

        {/* Live transcript card */}
        <div
          className="w-full relative"
          style={{
            padding: '14px 16px', maxHeight: 200, overflow: 'hidden',
            background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 16,
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow">Live transcript</span>
            <span
              className="font-mono flex items-center gap-1.5"
              style={{
                fontSize: 9, padding: '4px 9px', borderRadius: 99,
                background: '#ecfeff', border: '1px solid #06B6D4', color: '#06B6D4',
                letterSpacing: '0.06em',
              }}
            >
              <span className="dot animate-pulse-dot" />
              {wordCount} word{wordCount === 1 ? '' : 's'}
            </span>
          </div>

          {recError ? (
            <p className="m-0 font-mono" style={{ fontSize: 12, color: '#ef4444', lineHeight: 1.55 }}>
              {recError}
            </p>
          ) : lines.length === 0 ? (
            <p className="m-0 italic" style={{ fontSize: 13, lineHeight: 1.55, color: '#9CA3AF' }}>
              Listening… start speaking the patient report.
              <span style={{ color: '#06B6D4' }}> ▍</span>
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className="m-0"
                  style={{
                    fontSize: 13,
                    color: '#374151',
                    lineHeight: 1.45,
                  }}
                >
                  {line}
                  {i === lines.length - 1 && <span style={{ color: '#06B6D4' }}> ▍</span>}
                </p>
              ))}
            </div>
          )}

          {/* Bottom fade */}
          <div
            className="absolute left-0 right-0 bottom-0 h-8 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, #F3F4F6)', borderRadius: '0 0 16px 16px' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 w-full mt-auto pb-1">
          <button className="btn-ghost flex-1" onClick={onCancel}>
            <Pause size={14} /> Cancel
          </button>
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={handleStop}
            disabled={wordCount === 0 && !recError}
          >
            <Square size={14} />
            Stop &amp; generate
          </button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 py-3">
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#D1D5DB' }}>
          End-to-end encrypted · Nothing stored
        </span>
      </div>
    </div>
  );
}
