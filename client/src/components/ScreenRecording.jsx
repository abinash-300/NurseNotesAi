import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import BrandRow from './BrandRow.jsx';
import MicCore from './MicCore.jsx';
import AudioWaveform from './AudioWaveform.jsx';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };

function fmtTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function ScreenRecording({ transcript, setTranscript, onStop, onCancel, showToast }) {
  const [seconds,  setSeconds]  = useState(0);
  const [interim,  setInterim]  = useState('');
  const [recError, setRecError] = useState('');
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

      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="flex flex-col items-center px-4 pt-6 pb-8 gap-5">

          {/* Timer */}
          <div style={{ textAlign: 'center' }}>
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

            {/* Pulsing red dot status */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {!recError && (
                <span
                  className="animate-pulse-dot"
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block', flexShrink: 0 }}
                />
              )}
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: recError ? '#FF3B30' : '#8E8E93' }}>
                {recError ? 'Voice unavailable' : 'Recording'}
              </span>
            </div>
          </div>

          {/* Orb — tapping it is the primary stop action */}
          <MicCore recording onTap={handleStop} size={110} />

          {/* Real-time audio waveform */}
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', background: '#ffffff', padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <AudioWaveform active={!recError} height={56} />
          </div>

          {/* Live transcript card */}
          <div style={{ width: '100%' }}>
            <div style={{ paddingLeft: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Live Transcript
              </span>
            </div>

            <div className="apple-card w-full" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11, fontWeight: 500,
                    padding: '3px 9px', borderRadius: 99,
                    background: 'rgba(120,120,128,0.10)',
                    color: '#8E8E93',
                  }}
                >
                  {wordCount} word{wordCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ minHeight: 140, position: 'relative', overflow: 'hidden' }}>
                {recError ? (
                  <p style={{ margin: 0, fontSize: 14, color: '#FF3B30', lineHeight: 1.55 }}>{recError}</p>
                ) : lines.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 15, color: '#8E8E93', lineHeight: 1.55, fontStyle: 'italic' }}>
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
          </div>

          {/* Buttons: Cancel (white card) + Stop & generate (secondary grey, smaller) */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            <button
              onClick={onCancel}
              className="tap-scale"
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 500,
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            {/* Secondary: Stop & generate — smaller, grey */}
            <button
              onClick={handleStop}
              className="tap-scale"
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 500,
                background: 'rgba(120,120,128,0.12)',
                border: 'none',
                color: '#8E8E93',
                cursor: 'pointer',
              }}
            >
              Stop &amp; generate
            </button>
          </div>

          {/* Privacy footer */}
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
