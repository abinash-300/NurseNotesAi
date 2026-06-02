import React from 'react';
import { Mic, Square } from 'lucide-react';

export default function MicCore({ recording = false, onTap, size = 140 }) {
  const ringColor = recording ? 'rgba(255,59,48,0.22)' : 'rgba(6,182,212,0.22)';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Breathing ring — idle only */}
      {!recording && (
        <span
          className="animate-mic-breathe"
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            border: '2px solid rgba(6,182,212,0.28)',
            pointerEvents: 'none',
          }}
        />
      )}

      <button
        onClick={onTap}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: 'none',
          outline: `3px solid ${recording ? '#FF3B30' : '#06B6D4'}`,
          outlineOffset: 0,
          background: recording
            ? 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fff5f5 60%, #ffe4e4 100%)'
            : 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f0fafb 60%, #e0f7fa 100%)',
          boxShadow: '0 8px 32px rgba(6,182,212,0.18), 0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
          transition: 'outline-color 200ms ease, background 200ms ease',
        }}
      >
        {/* Top-left highlight dot for depth */}
        <span
          style={{
            position: 'absolute',
            width: Math.round(size * 0.11),
            height: Math.round(size * 0.11),
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.72)',
            top: '17%',
            left: '21%',
            pointerEvents: 'none',
          }}
        />

        <span style={{ position: 'relative', color: recording ? '#FF3B30' : '#06B6D4', transition: 'color 200ms ease' }}>
          {recording
            ? <Square size={Math.round(size * 0.26)} strokeWidth={2} />
            : <Mic    size={Math.round(size * 0.30)} strokeWidth={1.8} />}
        </span>
      </button>
    </div>
  );
}
