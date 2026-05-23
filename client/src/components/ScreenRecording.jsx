import React, { useState, useEffect, useRef } from 'react';
import { Square, Pause } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';
import Waveform from './Waveform.jsx';

function fmtTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function ScreenRecording({ transcript, setTranscript, onStop, onCancel }) {
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

  const handleStop = () => {
    shouldContinueRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    onStop();
  };

  const fullText  = (transcript || '') + (interim ? ' ' + interim : '');
  const lines     = fullText.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;

  return (
    <div className="screen">
      <BrandRow state="recording" />

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-3 gap-[18px]">
        {/* Timer */}
        <div className="text-center flex flex-col gap-1">
          <span
            className="font-sans font-semibold tabular-nums"
            style={{ fontSize: 52, letterSpacing: '-0.02em', color: '#fca5a5', lineHeight: 1 }}
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
        <Waveform active={!recError} count={42} color="#f87171" height={48} />

        {/* Live transcript card */}
        <div
          className="card-glass w-full relative"
          style={{ padding: '14px 16px', maxHeight: 200, overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow">Live transcript</span>
            <span className="chip chip-live" style={{ fontSize: 9 }}>
              <span className="dot animate-pulse-dot" />
              {wordCount} word{wordCount === 1 ? '' : 's'}
            </span>
          </div>

          {recError ? (
            <p className="m-0 font-mono" style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.55 }}>
              {recError}
            </p>
          ) : lines.length === 0 ? (
            <p className="m-0 text-ink-4 italic" style={{ fontSize: 13, lineHeight: 1.55 }}>
              Listening… start speaking the patient report.
              <span className="text-cyan-400"> ▍</span>
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className="m-0"
                  style={{
                    fontSize: 13,
                    color: i === lines.length - 1 ? '#f4f7ff' : '#c8d3ed',
                    lineHeight: 1.45,
                  }}
                >
                  {line}
                  {i === lines.length - 1 && <span className="text-cyan-400"> ▍</span>}
                </p>
              ))}
            </div>
          )}

          {/* Bottom fade */}
          <div
            className="absolute left-0 right-0 bottom-0 h-8 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, #050a1a)' }}
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
        <span className="font-mono text-ink-5 uppercase" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
          End-to-end encrypted · Nothing stored
        </span>
      </div>
    </div>
  );
}
