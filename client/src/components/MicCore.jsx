import React from 'react';
import { Mic, Square } from 'lucide-react';

export default function MicCore({ recording = false, onTap, size = 140 }) {
  return (
    <button
      onClick={onTap}
      aria-label={recording ? 'Stop recording' : 'Start recording'}
      className={recording ? 'animate-mic-glow-red' : 'animate-mic-glow'}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `3px solid ${recording ? '#ef4444' : '#06B6D4'}`,
        background: recording
          ? 'radial-gradient(circle, #fff5f5 0%, #ffffff 70%)'
          : 'radial-gradient(circle, #f0fafb 0%, #ffffff 70%)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Subtle inner ring */}
      <span
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius: '50%',
          border: `1px solid ${recording ? 'rgba(239,68,68,0.12)' : 'rgba(6,182,212,0.15)'}`,
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', color: recording ? '#ef4444' : '#06B6D4' }}>
        {recording ? <Square size={36} strokeWidth={2} /> : <Mic size={42} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
