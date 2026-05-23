import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Recorder from './components/Recorder.jsx';
import SoapOutput from './components/SoapOutput.jsx';

const SYSTEM_PROMPT = `You are an expert clinical documentation assistant specializing in nursing notes.
Convert the nurse's verbal report into a structured SOAP note.
Return ONLY a valid JSON object with exactly these four keys: "subjective", "objective", "assessment", "plan"
Each value should be a clear, concise clinical paragraph (2-5 sentences).
Use proper medical terminology. Be factual — only document what was stated.
Do not add assumptions. Do not include any text outside the JSON object.`;

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
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Convert this nurse's verbal report into a SOAP note:\n\n${transcript}`,
            },
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Groq API error');
      }

      let responseText = data.choices[0].message.content;
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const soapNote = JSON.parse(responseText);
      setSoap(soapNote);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Failed to parse AI response as JSON. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8">
        <Header />

        <main className="mt-6 sm:mt-8 space-y-6">
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

        <footer className="mt-12 sm:mt-16 pb-6 sm:pb-8 text-center">
          <p className="text-slate-600 text-[10px] sm:text-xs font-mono tracking-widest">
            NURSENOTE AI · PROTOTYPE · FOR EDUCATIONAL USE ONLY · NOT FOR REAL PATIENT DATA
          </p>
        </footer>
      </div>
    </div>
  );
}
