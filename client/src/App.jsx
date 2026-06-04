import React, { useState, useEffect, useCallback } from 'react';
import DisclaimerModal  from './components/DisclaimerModal.jsx';
import ScreenOnboarding from './components/ScreenOnboarding.jsx';
import ScreenIdle       from './components/ScreenIdle.jsx';
import ScreenRecording  from './components/ScreenRecording.jsx';
import ScreenProcessing from './components/ScreenProcessing.jsx';
import ScreenResult     from './components/ScreenResult.jsx';
import ScreenSettings   from './components/ScreenSettings.jsx';
import ScreenAbout      from './components/ScreenAbout.jsx';
import InstallPrompt    from './components/InstallPrompt.jsx';
import IOSInstallBanner from './components/iOSInstallBanner.jsx';
import SplashScreen     from './components/SplashScreen.jsx';
import OfflineBanner    from './components/OfflineBanner.jsx';
import CopyToast        from './components/CopyToast.jsx';
import SuccessBadge     from './components/SuccessBadge.jsx';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };

const DEMO_TRANSCRIPT =
  'Patient is a 68-year-old male presenting with chest tightness and shortness of breath that started about 2 hours ago. He rates the pain 6 out of 10, describes it as pressure-like, radiating to the left arm. He has a history of hypertension and type 2 diabetes. Current medications include metformin and lisinopril. He denies nausea or vomiting. Vitals on admission: blood pressure 158 over 94, heart rate 88 beats per minute, respiratory rate 20, oxygen saturation 96% on room air, temperature 98.6. Patient appears anxious but alert and oriented times 3. Lung sounds clear bilaterally, heart rhythm regular. 12-lead EKG ordered, troponin levels sent to lab. Patient placed on cardiac monitor. IV access established in right antecubital. Oxygen applied via nasal cannula at 2 liters. Nitroglycerin 0.4 mg sublingual administered per protocol. Physician notified of patient status.';

export default function App() {
  /* ── Disclaimer & onboarding gates ──────────────────────── */
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(
    () => !!localStorage.getItem('nursenote_disclaimer_accepted'),
  );
  const acceptDisclaimer = () => {
    localStorage.setItem('nursenote_disclaimer_accepted', '1');
    setDisclaimerAccepted(true);
  };

  const [onboarded, setOnboarded] = useState(
    () => !!localStorage.getItem('nursenote_onboarded'),
  );
  const completeOnboarding = () => {
    localStorage.setItem('nursenote_onboarded', '1');
    setOnboarded(true);
  };

  /* ── Splash screen — only on cold load ──────────────────── */
  const [showSplash, setShowSplash] = useState(() => {
    if (!disclaimerAccepted || !sessionStorage.getItem('nursenote_splash_shown')) {
      sessionStorage.setItem('nursenote_splash_shown', '1');
      return true;
    }
    return false;
  });

  /* ── Navigation state machine ────────────────────────────── */
  // screens: idle | recording | processing | result | settings | about
  const [screen,    setScreen]    = useState('idle');
  const [direction, setDirection] = useState('forward'); // forward | back

  const navigate = useCallback((to, dir = 'forward') => {
    setDirection(dir);
    setScreen(to);
  }, []);

  /* ── Session data ────────────────────────────────────────── */
  const [transcript,     setTranscript]     = useState('');
  const [soap,           setSoap]           = useState(null);
  const [meta,           setMeta]           = useState(null);
  const [sessions,       setSessions]       = useState([]);
  const [sessionCounter, setSessionCounter] = useState(1001);

  /* ── Settings — persisted ────────────────────────────────── */
  const [specialty,  setSpecialty]  = useState(() => localStorage.getItem('nursenote_specialty')    ?? 'general');
  const [noteLength, setNoteLength] = useState(() => localStorage.getItem('nursenote_note_length')  ?? 'standard');

  const handleSpecialtyChange  = (v) => { setSpecialty(v);  localStorage.setItem('nursenote_specialty',    v); };
  const handleNoteLengthChange = (v) => { setNoteLength(v); localStorage.setItem('nursenote_note_length',  v); };

  /* ── Error toast (dark, for errors/warnings) ─────────────── */
  const [toast, setToast] = useState('');
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 5000);
  }, []);

  /* ── Copy toast (white, slides from top) ─────────────────── */
  const [copyToast, setCopyToast] = useState('');
  const showCopyToast = useCallback((msg) => setCopyToast(msg), []);

  /* ── Success badge (after processing) ───────────────────── */
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── Flows ───────────────────────────────────────────────── */
  const startRecording = useCallback(() => {
    vibrate(50);
    setTranscript('');
    setSoap(null);
    setMeta(null);
    navigate('recording', 'forward');
  }, [navigate]);

  const stopAndProcess = useCallback(() => navigate('processing', 'forward'), [navigate]);

  const loadDemo = useCallback(() => {
    setTranscript(DEMO_TRANSCRIPT);
    setSoap(null);
    setMeta(null);
    navigate('processing', 'forward');
  }, [navigate]);

  const onProcessDone = useCallback((soapData, metaData) => {
    vibrate(100);
    const id = sessionCounter;
    const enrichedMeta = { ...metaData, sessionNumber: id, createdAt: Date.now() };
    setSoap(soapData);
    setMeta(enrichedMeta);
    setSessions((prev) => [{ id, soap: soapData, meta: enrichedMeta }, ...prev].slice(0, 5));
    setSessionCounter((n) => n + 1);
    setShowSuccess(true);
    navigate('result', 'forward');
  }, [sessionCounter, navigate]);

  const onProcessError = useCallback((msg) => {
    vibrate([100, 50, 100]);
    showToast(msg);
    navigate('idle', 'back');
  }, [showToast, navigate]);

  const newSession = useCallback(() => {
    setTranscript('');
    setSoap(null);
    setMeta(null);
    navigate('idle', 'back');
  }, [navigate]);

  const openSession = useCallback((session) => {
    setSoap(session.soap);
    setMeta(session.meta);
    navigate('result', 'forward');
  }, [navigate]);

  /* ── Keyboard shortcuts ──────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (screen === 'idle')      startRecording();
        else if (screen === 'recording') stopAndProcess();
      } else if (e.code === 'Enter' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (screen === 'recording') stopAndProcess();
      } else if (e.code === 'Escape') {
        if (screen === 'recording') newSession();
        else if (screen === 'result') newSession();
        else if (screen === 'settings' || screen === 'about') navigate('idle', 'back');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, startRecording, stopAndProcess, newSession, navigate]);

  /* ── Screens that block the disclaimer/onboarding gates ─── */
  if (!disclaimerAccepted) {
    return <DisclaimerModal onAccept={acceptDisclaimer} />;
  }

  if (!onboarded) {
    return <ScreenOnboarding onComplete={completeOnboarding} />;
  }

  const slideClass = direction === 'forward' ? 'animate-slide-from-right' : 'animate-slide-from-left';

  return (
    <div className="nav-root" aria-live="polite" aria-atomic="false">
      <InstallPrompt />
      <OfflineBanner />

      {/* Splash (fixed overlay, fades out automatically) */}
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* Success badge overlay */}
      {showSuccess && <SuccessBadge onDone={() => setShowSuccess(false)} />}

      {/* Copy toast (slides in from top) */}
      {copyToast && <CopyToast message={copyToast} onDone={() => setCopyToast('')} />}

      {/* Error toast (dark, bottom) */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'fixed', top: 'calc(16px + env(safe-area-inset-top))', left: 16, right: 16, zIndex: 70,
            background: '#111827', borderRadius: 14,
            color: '#ffffff', fontSize: 14, padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Screen container — key drives the slide animation */}
      <div key={screen} className={slideClass} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {screen === 'idle' && (
          <>
            <ScreenIdle
              onStart={startRecording}
              onDemo={loadDemo}
              sessions={sessions}
              onOpenSession={openSession}
              specialty={specialty}
              onSpecialtyChange={handleSpecialtyChange}
              noteLength={noteLength}
              onNoteLengthChange={handleNoteLengthChange}
              onSettings={() => navigate('settings', 'forward')}
              onAbout={() => navigate('about', 'forward')}
            />
            <IOSInstallBanner />
          </>
        )}

        {screen === 'recording' && (
          <ScreenRecording
            transcript={transcript}
            setTranscript={setTranscript}
            onStop={stopAndProcess}
            onCancel={newSession}
            showToast={showToast}
          />
        )}

        {screen === 'processing' && (
          <ScreenProcessing
            transcript={transcript}
            specialty={specialty}
            noteLength={noteLength}
            onDone={onProcessDone}
            onError={onProcessError}
          />
        )}

        {screen === 'result' && (
          <ScreenResult
            soap={soap}
            meta={meta}
            onNew={newSession}
            showToast={showToast}
            showCopyToast={showCopyToast}
          />
        )}

        {screen === 'settings' && (
          <ScreenSettings
            specialty={specialty}
            noteLength={noteLength}
            onSpecialtyChange={handleSpecialtyChange}
            onNoteLengthChange={handleNoteLengthChange}
            onBack={() => navigate('idle', 'back')}
            showToast={showToast}
          />
        )}

        {screen === 'about' && (
          <ScreenAbout onBack={() => navigate('idle', 'back')} />
        )}
      </div>
    </div>
  );
}
