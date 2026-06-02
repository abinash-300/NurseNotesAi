import React, { useState, useEffect, useRef } from 'react';
import { Brain, Check, Activity } from 'lucide-react';
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

  const specialtyLabel = SPECIALTY_LABELS[specialty] ?? 'General';
  const lengthLabel    = LENGTH_LABELS[noteLength]   ?? 'Standard';

  useEffect(() => {
    if (step >= SOAP_META.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const t = setInterval(() => setTick(Date.now() - startedAt.current), 100);
    return () => clearInterval(t);
  }, []);

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
          specialty,
          noteLength,
          wordsIn:  transcript.trim().split(/\s+/).length,
          wordsOut: Object.values(soap).join(' ').trim().split(/\s+/).length,
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">

        {/* Brain in 80px white circle + slow-spin */}
        <div
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span className="animate-slow-spin inline-flex" style={{ color: '#06B6D4' }}>
            <Brain size={32} strokeWidth={1.6} />
          </span>
        </div>

        {/* Title + context */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#000000', letterSpacing: '-0.015em' }}>
            Synthesizing note
          </div>
          <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 6 }}>
            {wordCount} words · {specialtyLabel} · {lengthLabel}
          </div>
        </div>

        {/* S → O → A → P pipeline */}
        <div className="apple-card w-full overflow-hidden">
          {SOAP_META.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div key={s.key}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '0 16px',
                    height: 56,
                    opacity: i > step ? 0.30 : 1,
                    transition: 'opacity 300ms',
                  }}
                >
                  {/* 36px circle */}
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600,
                      background: done ? 'rgba(52,199,89,0.12)' : active ? `${s.color}18` : 'rgba(120,120,128,0.10)',
                      color: done ? '#34C759' : active ? s.color : '#8E8E93',
                      position: 'relative', flexShrink: 0,
                    }}
                  >
                    {done ? <Check size={15} /> : s.letter}
                    {active && (
                      <span
                        className="absolute animate-pulse-dot"
                        style={{ inset: -3, borderRadius: '50%', border: `1.5px solid ${s.color}50` }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#000000' }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 1 }}>
                      {done ? 'Synthesized' : active ? 'Writing…' : 'Pending'}
                    </div>
                  </div>

                  {done && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#34C759', background: 'rgba(52,199,89,0.12)', padding: '3px 9px', borderRadius: 99 }}>
                      OK
                    </span>
                  )}
                </div>
                {/* Ultra-subtle #F2F2F7 divider */}
                {i < SOAP_META.length - 1 && (
                  <div style={{ height: 1, background: '#F2F2F7', marginLeft: 16 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Elapsed + Groq chip */}
        <div className="apple-card w-full" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} style={{ color: '#06B6D4' }} />
            <span style={{ fontSize: 14, color: '#000000', fontVariantNumeric: 'tabular-nums' }}>
              {(tick / 1000).toFixed(1)}s elapsed
            </span>
          </div>
          {/* Groq chip: #EFF9FF bg, #BAE6FD border, #06B6D4 text */}
          <span
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
              padding: '4px 10px', borderRadius: 99,
              background: '#EFF9FF',
              border: '1px solid #BAE6FD',
              color: '#06B6D4',
            }}
          >
            Groq · {specialtyLabel}
          </span>
        </div>

      </div>

      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <span style={{ fontSize: 11, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Encrypted in transit · Groq cloud
        </span>
      </div>
    </div>
  );
}
