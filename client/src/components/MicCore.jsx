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
        border: 'none',
        background: recording
          ? 'radial-gradient(circle at 50% 35%, #fca5a5 0%, #b91c1c 60%, #450a0a 100%)'
          : 'radial-gradient(circle at 50% 35%, #67e8f9 0%, #0891b2 60%, #052e3a 100%)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Inner depth highlight */}
      <span
        style={{
          position: 'absolute',
          inset: 4,
          borderRadius: '50%',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -8px 24px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', color: '#03101a' }}>
        {recording ? <Square size={36} /> : <Mic size={42} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
