import React, { useState, useEffect, useRef } from 'react';
import { Brain, Check, Activity, Shield } from 'lucide-react';
import BrandRow from './BrandRow.jsx';

const BASE_PROMPT = `You are an expert clinical documentation assistant specializing in nursing notes.
Convert the nurse's verbal report into a structured SOAP note.
Return ONLY a valid JSON object with exactly these four keys: "subjective", "objective", "assessment", "plan"
Each value should be a clear, concise clinical paragraph (2-5 sentences).
Use proper medical terminology. Be factual — only document what was stated.
Do not add assumptions. Do not include any text outside the JSON object.`;

const SPECIALTY_ADDONS = {
  general:    '',
  icu:        'Specialty focus — ICU: emphasize ventilator settings (mode, FiO2, PEEP, tidal volume), vasoactive drips (name, dose, concentration), neuro checks (GCS, pupil response), and hourly outputs (urine, drains).',
  er:         'Specialty focus — ER: emphasize triage acuity, chief complaint with onset and severity, time-sensitive interventions performed, disposition plan, and pending consults or orders.',
  medsurg:    'Specialty focus — Med-Surg: emphasize ADL status and functional ability, mobility and fall risk, wound care details, pain management, and discharge planning needs including patient education.',
  pediatrics: 'Specialty focus — Pediatrics: emphasize patient weight and weight-based dosing, age-appropriate developmental assessments, guardian presence and education given, immunization history if relevant.',
  cardiac:    'Specialty focus — Cardiac: emphasize cardiac rhythm and rate, ejection fraction if known, chest pain characteristics (onset, quality, radiation, severity), cardiac enzyme results, hemodynamic status, and cardiac medications.',
};

const SPECIALTY_LABELS = {
  general: 'General', icu: 'ICU', er: 'ER',
  medsurg: 'Med-Surg', pediatrics: 'Pediatrics', cardiac: 'Cardiac',
};

const LENGTH_ADDONS = {
  brief:    'Format: Be concise. Use bullet points where appropriate. Keep each section to 1-2 sentences maximum.',
  standard: '',
  detailed: 'Format: Be comprehensive. Include clinical reasoning and potential differentials in the assessment section. Provide detailed rationale for each item in the plan. Target 4-6 sentences per section.',
};

const LENGTH_LABELS = {
  brief: 'Brief', standard: 'Standard', detailed: 'Detailed',
};

const MODEL = 'llama-3.1-8b-instant';

const SOAP_META = [
  { key: 'subjective', letter: 'S', title: 'Subjective', color: '#fb923c' },
  { key: 'objective',  letter: 'O', title: 'Objective',  color: '#22d3ee' },
  { key: 'assessment', letter: 'A', title: 'Assessment', color: '#c084fc' },
  { key: 'plan',       letter: 'P', title: 'Plan',       color: '#34d399' },
];

function buildPrompt(specialty, noteLength) {
  const parts = [BASE_PROMPT];
  const specialtyAddon = SPECIALTY_ADDONS[specialty] ?? '';
  const lengthAddon    = LENGTH_ADDONS[noteLength]    ?? '';
  if (specialtyAddon) parts.push(specialtyAddon);
  if (lengthAddon)    parts.push(lengthAddon);
  return parts.join('\n\n');
}

async function callGroq(transcript, systemPrompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
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

export default function ScreenProcessing({ transcript, specialty = 'general', noteLength = 'standard', onDone, onError }) {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);
  const startedAt = useRef(Date.now());

  const specialtyLabel = SPECIALTY_LABELS[specialty]  ?? 'General';
  const lengthLabel    = LENGTH_LABELS[noteLength]     ?? 'Standard';

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
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 5) {
      onError('Transcript too short. Please record at least a few words or use the demo patient button.');
      return;
    }
    const systemPrompt = buildPrompt(specialty, noteLength);
    (async () => {
      try {
        const soap = await callGroq(transcript, systemPrompt);
        if (cancelled) return;
        const elapsed = Date.now() - startedAt.current;
        const meta = {
          ms:         elapsed,
          model:      MODEL,
          specialty:  specialty,
          noteLength: noteLength,
          wordsIn:    transcript.trim().split(/\s+/).length,
          wordsOut:   Object.values(soap).join(' ').trim().split(/\s+/).length,
        };
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
            className="flex items-center justify-center"
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#ecfeff',
              border: '1px solid #06B6D4',
              color: '#06B6D4',
              boxShadow: '0 0 0 6px rgba(6,182,212,0.08)',
            }}
          >
            <span className="animate-spin inline-flex"><Brain size={28} /></span>
          </div>
          <h2
            className="m-0 font-semibold"
            style={{ fontSize: 22, letterSpacing: '-0.015em', color: '#111827' }}
          >
            Synthesizing note
          </h2>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.06em', color: '#9CA3AF' }}>
            {wordCount} words · {specialtyLabel} · {lengthLabel}
          </span>
        </div>

        {/* S → O → A → P pipeline */}
        <div
          style={{
            background: '#ffffff', border: '1px solid #D1D5DB',
            borderRadius: 16, padding: '6px 4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {SOAP_META.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div
                key={s.key}
                className="flex items-center gap-3.5 px-4 py-3.5"
                style={{
                  borderBottom: i < SOAP_META.length - 1 ? '1px solid #D1D5DB' : 'none',
                  opacity: i > step ? 0.35 : 1,
                  transition: 'opacity 300ms',
                }}
              >
                <div
                  className="flex items-center justify-center font-mono relative flex-shrink-0"
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    fontSize: 13, fontWeight: 500,
                    border: `1px solid ${done ? '#22C55E' : active ? s.color : '#D1D5DB'}`,
                    background: done ? '#f0fdf4' : active ? `${s.color}14` : '#F3F4F6',
                    color: done ? '#22C55E' : active ? s.color : '#9CA3AF',
                  }}
                >
                  {done ? <Check size={14} /> : s.letter}
                  {active && (
                    <span
                      className="absolute animate-pulse-dot"
                      style={{ inset: -3, borderRadius: '50%', border: `1px solid ${s.color}44` }}
                    />
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <span className="font-medium" style={{ fontSize: 14, color: '#111827' }}>{s.title}</span>
                  <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: '#9CA3AF' }}>
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
          style={{ background: '#F3F4F6', border: '1px solid #D1D5DB' }}
        >
          <div className="flex items-center gap-2.5">
            <Activity size={14} style={{ color: '#06B6D4' }} />
            <span style={{ fontSize: 12.5, color: '#6B7280' }}>
              {(tick / 1000).toFixed(1)}s elapsed
            </span>
          </div>
          <span className="chip chip-live" style={{ fontSize: 9 }}>
            <span className="dot animate-pulse-dot" /> {specialtyLabel} template · Groq live
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 py-3">
        <Shield size={11} style={{ color: '#D1D5DB' }} />
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: '#D1D5DB' }}>
          Encrypted in transit · Groq cloud
        </span>
      </div>
    </div>
  );
}
