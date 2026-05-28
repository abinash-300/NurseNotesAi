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
        border: `1px solid ${recording ? 'rgba(248,113,113,0.3)' : 'rgba(0,212,255,0.3)'}`,
        background: recording
          ? 'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.85) 0%, rgba(255,200,200,0.65) 10%, #fca5a5 24%, #b91c1c 62%, #450a0a 100%)'
          : 'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.90) 0%, rgba(200,245,255,0.70) 12%, #00e5ff 28%, #0080aa 65%, #003344 100%)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Specular highlight — top-left light reflection */}
      <span
        style={{
          position: 'absolute',
          top: '12%',
          left: '14%',
          width: '32%',
          height: '28%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.18) 60%, transparent 100%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
        }}
      />
      {/* Inner rim shadow for depth */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 -6px 20px rgba(0,0,0,0.45), inset 0 2px 6px rgba(255,255,255,0.15)',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', color: recording ? '#fff' : '#03101a', filter: recording ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
        {recording ? <Square size={36} /> : <Mic size={42} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
