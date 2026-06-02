import React from 'react';
import { Mic, Square } from 'lucide-react';

export default function MicCore({ recording = false, onTap, size = 140 }) {
  return (
    <button
      onClick={onTap}
      aria-label={recording ? 'Stop recording' : 'Start recording'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        outline: `3px solid ${recording ? '#FF3B30' : '#06B6D4'}`,
        outlineOffset: 0,
        background: '#ffffff',
        boxShadow: recording
          ? '0 0 0 6px rgba(255,59,48,0.06), 0 4px 20px rgba(0,0,0,0.08)'
          : '0 0 0 6px rgba(6,182,212,0.06), 0 4px 20px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
        transition: 'outline-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      <span style={{ color: recording ? '#FF3B30' : '#06B6D4', transition: 'color 200ms ease' }}>
        {recording ? <Square size={Math.round(size * 0.26)} strokeWidth={2} /> : <Mic size={Math.round(size * 0.30)} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
