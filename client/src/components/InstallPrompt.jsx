import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible]               = useState(false);

  useEffect(() => {
    // Only show if not already dismissed this session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    sessionStorage.setItem('pwa_prompt_dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 60,
        background: '#ffffff',
        borderBottom: '1px solid #D1D5DB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        paddingTop: 'calc(10px + env(safe-area-inset-top))',
        fontFamily: 'Sora, system-ui, sans-serif',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: '#ecfeff',
          border: '1px solid #06B6D4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#06B6D4',
        }}
      >
        <Download size={16} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>
          Add NurseNote to your home screen
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>
          Works offline · Instant launch
        </div>
      </div>

      {/* Install button */}
      <button
        onClick={install}
        style={{
          flexShrink: 0,
          padding: '7px 14px',
          borderRadius: 8,
          background: '#06B6D4',
          border: 'none',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Install
      </button>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: 6,
          background: '#F3F4F6',
          border: '1px solid #D1D5DB',
          color: '#6B7280',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
