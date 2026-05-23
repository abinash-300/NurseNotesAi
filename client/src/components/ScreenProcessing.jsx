import React, { useState, useEffect, useRef } from 'react';
import { Brain, Check, Activity, Shield } from 'lucide-react';
import BrandRow from './BrandRow.jsx';

const SYSTEM_PROMPT = `You are an expert clinical documentation assistant specializing in nursing notes.
Convert the nurse's verbal report into a structured SOAP note.
Return ONLY a valid JSON object with exactly these four keys: "subjective", "objective", "assessment", "plan"
Each value should be a clear, concise clinical paragraph (2-5 sentences).
Use proper medical terminology. Be factual — only document what was stated.
Do not add assumptions. Do not include any text outside the JSON object.`;

const MODEL = 'llama-3.1-8b-instant';

const SOAP_META = [
  { key: 'subjective', letter: 'S', title: 'Subjective', color: '#fb923c' },
  { key: 'objective',  letter: 'O', title: 'Objective',  color: '#22d3ee' },
  { key: 'assessment', letter: 'A', title: 'Assessment', color: '#c084fc' },
  { key: 'plan',       letter: 'P', title: 'Plan',       color: '#34d399' },
];

async function callGroq(transcript) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: `Convert this nurse's verbal report into a SOAP note:\n\n${transcript}` },
      ],
      max_tokens: 1000,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Groq API error');
  let text = data.choices[0].message.content;
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

export default function ScreenProcessing({ transcript, onDone, onError }) {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);
  const startedAt = useRef(Date.now());

  // Cosmetic pipeline — one step every 550 ms
  useEffect(() => {
    if (step >= SOAP_META.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [step]);

  // Elapsed ticker
  useEffect(() => {
    const t = setInterval(() => setTick(Date.now() - startedAt.current), 100);
    return () => clearInterval(t);
  }, []);

  // Real API call
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const soap = await callGroq(transcript);
        if (cancelled) return;
        const elapsed = Date.now() - startedAt.current;
        const meta = {
          ms:       elapsed,
          model:    MODEL,
          wordsIn:  transcript.trim().split(/\s+/).length,
          wordsOut: Object.values(soap).join(' ').trim().split(/\s+/).length,
        };
        // Let the pipeline animation finish before transitioning
        const minDelay = (SOAP_META.length - 1) * 550 + 200;
        const wait = Math.max(0, minDelay - elapsed);
        setTimeout(() => { if (!cancelled) onDone(soap, meta); }, wait);
      } catch (err) {
        if (!cancelled) onError(err instanceof SyntaxError ? 'Failed to parse AI response as JSON. Please try again.' : (err.message || String(err)));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const wordCount = transcript.trim().split(/\s+/).length;

  return (
    <div className="screen">
      <BrandRow state="processing" />

      <div className="relative z-10 flex-1 flex flex-col px-5 pt-5 gap-[22px]">
        {/* Spinning brain */}
        <div className="text-center flex flex-col items-center gap-2 mt-3">
          <div
            className="flex items-center justify-center text-cyan-400"
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 30%, rgba(34,211,238,0.25), transparent 70%)',
              border: '1px solid rgba(34,211,238,0.25)',
              boxShadow: 'var(--glow-cyan-md)',
            }}
          >
            <span className="animate-spin inline-flex"><Brain size={28} /></span>
          </div>
          <h2
            className="text-ink-1 font-semibold m-0"
            style={{ fontSize: 22, letterSpacing: '-0.015em' }}
          >
            Synthesizing note
          </h2>
          <span className="font-mono text-ink-4" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
            {wordCount} words · {MODEL}
          </span>
        </div>

        {/* S → O → A → P pipeline */}
        <div className="card-solid" style={{ padding: '6px 4px' }}>
          {SOAP_META.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div
                key={s.key}
                className="flex items-center gap-3.5 px-4 py-3.5"
                style={{
                  borderBottom: i < SOAP_META.length - 1 ? '1px solid var(--navy-border)' : 'none',
                  opacity: i > step ? 0.35 : 1,
                  transition: 'opacity 300ms',
                }}
              >
                {/* Ring */}
                <div
                  className="flex items-center justify-center font-mono relative flex-shrink-0"
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    fontSize: 13, fontWeight: 500,
                    border: `1px solid ${done ? s.color + '88' : active ? s.color + '55' : 'var(--navy-border)'}`,
                    background: done ? s.color + '22' : 'transparent',
                    color: done || active ? s.color : '#5f6e96',
                  }}
                >
                  {done ? <Check size={14} /> : s.letter}
                  {active && (
                    <span
                      className="absolute animate-pulse-dot"
                      style={{ inset: -3, borderRadius: '50%', border: `1px solid ${s.color}66` }}
                    />
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-ink-1 font-medium" style={{ fontSize: 14 }}>{s.title}</span>
                  <span className="font-mono text-ink-4" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
                    {done ? 'Synthesized' : active ? 'Writing…' : 'Pending'}
                  </span>
                </div>
                {done && <span className="chip chip-ok" style={{ fontSize: 9 }}>OK</span>}
              </div>
            );
          })}
        </div>

        {/* Elapsed */}
        <div
          className="flex items-center justify-between px-3.5 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--navy-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-ink-2" style={{ fontSize: 12.5 }}>
              {(tick / 1000).toFixed(1)}s elapsed
            </span>
          </div>
          <span className="chip chip-live" style={{ fontSize: 9 }}>
            <span className="dot animate-pulse-dot" /> Groq · live
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 py-3">
        <Shield size={11} className="text-ink-5" />
        <span className="font-mono text-ink-5 uppercase" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
          Encrypted in transit · Groq cloud
        </span>
      </div>
    </div>
  );
}
