import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Recorder from './components/Recorder.jsx';
import SoapOutput from './components/SoapOutput.jsx';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [soap, setSoap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSOAP = async () => {
    setLoading(true);
    setSoap(null);
    setError(null);

    try {
      const response = await fetch('/api/generate-soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate SOAP note');
      }

      setSoap(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header />

        <main className="mt-8 space-y-6">
          <Recorder
            transcript={transcript}
            setTranscript={setTranscript}
            onGenerate={generateSOAP}
            loading={loading}
          />

          {error && (
            <div className="border border-red-500 bg-red-950/30 rounded-lg p-4">
              <p className="text-red-400 text-sm font-mono">ERROR: {error}</p>
            </div>
          )}

          <SoapOutput soap={soap} />
        </main>

        <footer className="mt-16 pb-8 text-center">
          <p className="text-slate-600 text-xs font-mono tracking-widest">
            NURSENOTE AI · PROTOTYPE · FOR EDUCATIONAL USE ONLY · NOT FOR REAL PATIENT DATA
          </p>
        </footer>
      </div>
    </div>
  );
}
