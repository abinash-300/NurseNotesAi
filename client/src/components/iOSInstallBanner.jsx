import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

const DISMISS_KEY  = 'nursenote_ios_install_dismissed';
const isIPhone     = /iPhone/i.test(navigator.userAgent);
const isStandalone = window.navigator.standalone === true;

export default function IOSInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => !!localStorage.getItem(DISMISS_KEY),
  );

  if (!isIPhone || isStandalone || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 200,
        background: '#ffffff',
        borderTop: '2px solid #06B6D4',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ padding: '14px 16px 6px' }}>
        {/* Message row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              📲 Install NurseNote
            </span>
            <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.4 }}>
              Tap{' '}
              <span style={{ fontWeight: 600, color: '#06B6D4' }}>Share</span>
              {' '}then{' '}
              <span style={{ fontWeight: 600, color: '#111827' }}>Add to Home Screen</span>
            </span>
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss install banner"
            style={{
              flexShrink: 0,
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F3F4F6', border: '1px solid #D1D5DB',
              borderRadius: '50%', cursor: 'pointer', color: '#6B7280',
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Bouncing arrow — points toward the Safari Share button below */}
        <div className="flex justify-center pt-2 pb-0.5">
          <div className="animate-bounce" style={{ color: '#06B6D4' }}>
            <ChevronDown size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
