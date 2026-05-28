import React, { useState } from 'react';
import DisclaimerModal  from './components/DisclaimerModal.jsx';
import ScreenOnboarding from './components/ScreenOnboarding.jsx';
import ScreenIdle      from './components/ScreenIdle.jsx';
import ScreenRecording from './components/ScreenRecording.jsx';
import ScreenProcessing from './components/ScreenProcessing.jsx';
import ScreenResult    from './components/ScreenResult.jsx';

const vibrate = (pattern) => { try { navigator.vibrate?.(pattern); } catch {} };

const DEMO_TRANSCRIPT =
  'Patient is a 68-year-old male presenting with chest tightness and shortness of breath that started about 2 hours ago. He rates the pain 6 out of 10, describes it as pressure-like, radiating to the left arm. He has a history of hypertension and type 2 diabetes. Current medications include metformin and lisinopril. He denies nausea or vomiting. Vitals on admission: blood pressure 158 over 94, heart rate 88 beats per minute, respiratory rate 20, oxygen saturation 96% on room air, temperature 98.6. Patient appears anxious but alert and oriented times 3. Lung sounds clear bilaterally, heart rhythm regular. 12-lead EKG ordered, troponin levels sent to lab. Patient placed on cardiac monitor. IV access established in right antecubital. Oxygen applied via nasal cannula at 2 liters. Nitroglycerin 0.4 mg sublingual administered per protocol. Physician notified of patient status.';

// State machine: idle → recording → processing → result
//                                  ↑ (demo shortcut)
export default function App() {
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

  const [screen,         setScreen]         = useState('idle');
  const [transcript,     setTranscript]     = useState('');
  const [soap,           setSoap]           = useState(null);
  const [meta,           setMeta]           = useState(null);
  const [toast,          setToast]          = useState('');
  const [sessions,       setSessions]       = useState([]);
  const [sessionCounter, setSessionCounter] = useState(1001);
  const [specialty,      setSpecialty]      = useState('general');
  const [noteLength,     setNoteLength]     = useState('standard');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 5000);
  };

  const startRecording = () => {
    vibrate(50);
    setTranscript('');
    setSoap(null);
    setMeta(null);
    setScreen('recording');
  };

  const stopAndProcess = () => setScreen('processing');

  const loadDemo = () => {
    setTranscript(DEMO_TRANSCRIPT);
    setSoap(null);
    setMeta(null);
    setScreen('processing');
  };

  const onProcessDone = (soapData, metaData) => {
    vibrate(100);
    const id = sessionCounter;
    const enrichedMeta = { ...metaData, sessionNumber: id, createdAt: Date.now() };
    setSoap(soapData);
    setMeta(enrichedMeta);
    setSessions((prev) => [{ id, soap: soapData, meta: enrichedMeta }, ...prev].slice(0, 5));
    setSessionCounter((n) => n + 1);
    setScreen('result');
  };

  const onProcessError = (msg) => {
    vibrate([100, 50, 100]);
    showToast(msg);
    setScreen('idle');
  };

  const newSession = () => {
    setTranscript('');
    setSoap(null);
    setMeta(null);
    setScreen('idle');
  };

  const openSession = (session) => {
    setSoap(session.soap);
    setMeta(session.meta);
    setScreen('result');
  };

  if (!disclaimerAccepted) {
    return <DisclaimerModal onAccept={acceptDisclaimer} />;
  }

  if (!onboarded) {
    return <ScreenOnboarding onComplete={completeOnboarding} />;
  }

  return (
    <>
      {/* Error toast */}
      {toast && (
        <div
          className="fixed top-4 left-4 right-4 z-50 rounded-xl px-4 py-3 font-mono text-sm"
          style={{
            background: 'rgba(127,29,29,0.92)',
            border: '1px solid rgba(248,113,113,0.30)',
            color: '#fca5a5',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toast}
        </div>
      )}

      {screen === 'idle' && (
        <ScreenIdle onStart={startRecording} onDemo={loadDemo} sessions={sessions} onOpenSession={openSession} specialty={specialty} onSpecialtyChange={setSpecialty} noteLength={noteLength} onNoteLengthChange={setNoteLength} />
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
        <ScreenResult soap={soap} meta={meta} onNew={newSession} showToast={showToast} />
      )}
    </>
  );
}
