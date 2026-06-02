import React from 'react';
import { Zap, Info, X } from 'lucide-react';

export default function ProfileSheet({ onDemo, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div
        className="animate-slide-up"
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
          background: '#F2F2F7',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 12px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#C7C7CC' }} />
        </div>

        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 10px' }}>
          <button
            onClick={onClose}
            className="tap-scale"
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(120,120,128,0.14)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#8E8E93',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Rows */}
        <div className="apple-card" style={{ margin: '0 16px', overflow: 'hidden' }}>
          {/* Try Demo Patient */}
          <button
            onClick={() => { onClose(); onDemo(); }}
            className="tap-scale"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '15px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(6,182,212,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Zap size={18} style={{ color: '#06B6D4' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#000000' }}>Try Demo Patient</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>Load a sample cardiac case</div>
            </div>
          </button>

          <div style={{ height: 0.5, background: '#F2F2F7', marginLeft: 66 }} />

          {/* About */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '15px 16px',
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(120,120,128,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Info size={18} style={{ color: '#8E8E93' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#000000' }}>About NurseNote</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>v1.0 · End-to-end encrypted · Nothing stored</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
