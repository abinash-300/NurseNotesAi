import React, { useState, useRef } from 'react';
import TranscriptBox from './TranscriptBox.jsx';
import GenerateButton from './GenerateButton.jsx';

const DEMO_TRANSCRIPT =
  'Patient is a 68-year-old male presenting with chest tightness and shortness of breath that started about 2 hours ago. He rates the pain 6 out of 10, describes it as pressure-like, radiating to the left arm. He has a history of hypertension and type 2 diabetes. Current medications include metformin and lisinopril. He denies nausea or vomiting. Vitals on admission: blood pressure 158 over 94, heart rate 88 beats per minute, respiratory rate 20, oxygen saturation 96% on room air, temperature 98.6. Patient appears anxious but alert and oriented times 3. Lung sounds clear bilaterally, heart rhythm regular. 12-lead EKG ordered, troponin levels sent to lab. Patient placed on cardiac monitor. IV access established in right antecubital. Oxygen applied via nasal cannula at 2 liters. Nitroglycerin 0.4 mg sublingual administered per protocol. Physician notified of patient status.';

export default function Recorder({ transcript, setTranscript, onGenerate, loading }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recError, setRecError] = useState('');
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecError('Voice not supported here. On iPhone use Chrome; on desktop use Chrome or Edge.');
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onend = () => {
      if (shouldContinueRef.current) {
        recognition.start();
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        setRecError(`Recognition error: ${event.error}`);
        shouldContinueRef.current = false;
        setIsRecording(false);
      }
    };

    shouldContinueRef.current = true;
    recognitionRef.current = recognition;
    recognition.start();
    return true;
  };

  const toggleRecording = () => {
    if (isRecording) {
      shouldContinueRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setInterimTranscript('');
      setIsRecording(false);
    } else {
      setRecError('');
      const started = startRecognition();
      if (started) setIsRecording(true);
    }
  };

  const loadDemo = () => {
    setTranscript(DEMO_TRANSCRIPT);
    setInterimTranscript('');
  };

  const displayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : '');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-8 flex flex-col items-center gap-5 sm:gap-6">
      {/* Mic button */}
      <div className="relative flex items-center justify-center">
        {isRecording && (
          <span className="absolute w-[88px] h-[88px] rounded-full border-2 border-red-400 animate-pulse-ring pointer-events-none" />
        )}
        <button
          onClick={toggleRecording}
          className={`w-[88px] h-[88px] rounded-full flex items-center justify-center text-3xl transition-all duration-200 border-2 ${
            isRecording
              ? 'border-red-400 bg-red-950/40 hover:bg-red-950/60'
              : 'border-cyan-400 bg-slate-800 hover:bg-slate-700'
          }`}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>
      </div>

      {/* Waveform bars */}
      {isRecording && (
        <div className="flex items-center gap-1 h-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-400 rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Status label */}
      <p
        className={`text-xs font-mono uppercase tracking-widest ${
          isRecording ? 'text-red-400' : 'text-slate-500'
        }`}
      >
        {isRecording ? 'Recording… Tap to Stop' : 'Tap to Record'}
      </p>

      {/* Recognition error */}
      {recError && (
        <p className="text-red-400 text-sm font-mono text-center">{recError}</p>
      )}

      {/* Demo patient loader */}
      <button
        onClick={loadDemo}
        className="text-xs font-mono text-cyan-500 border border-dashed border-cyan-800 hover:border-cyan-500 hover:text-cyan-400 px-4 py-2 rounded-lg transition-colors"
      >
        ⚡ Load Demo Patient
      </button>

      {/* Transcript + Generate — shown only when content exists */}
      {displayTranscript && (
        <div className="w-full space-y-4">
          <TranscriptBox transcript={displayTranscript} />
          <GenerateButton onClick={onGenerate} disabled={loading} loading={loading} />
        </div>
      )}
    </div>
  );
}
