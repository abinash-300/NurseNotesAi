import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner() {
  const [status,  setStatus]  = useState(navigator.onLine ? 'online' : 'offline');
  const [visible, setVisible] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setStatus('back-online');
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
    const handleOffline = () => {
      setStatus('offline');
      setVisible(true);
    };
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!visible) return null;

  const offline = status === 'offline';

  return (
    <div
      className="animate-slide-down-in"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
        padding: '10px 16px',
        paddingTop: 'calc(10px + env(safe-area-inset-top))',
        background: offline ? '#FEF3C7' : '#DCFCE7',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      }}
    >
      {offline
        ? <WifiOff size={14} style={{ color: '#92400E', flexShrink: 0 }} aria-hidden="true" />
        : <Wifi    size={14} style={{ color: '#166534', flexShrink: 0 }} aria-hidden="true" />
      }
      <span style={{ fontSize: 13, fontWeight: 500, color: offline ? '#92400E' : '#166534' }}>
        {offline ? "You're offline — AI generation unavailable" : 'Back online'}
      </span>
    </div>
  );
}
