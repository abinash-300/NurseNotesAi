import React, { useState, useRef } from 'react';
import { Mic, Brain, Shield, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    icon: 'mic',
    color: '#22d3ee',
    title: 'Voice to SOAP in seconds',
    subtitle: 'Speak naturally about your patient. NurseNote structures it into a clinical note instantly.',
  },
  {
    icon: 'brain',
    color: '#c084fc',
    title: 'AI built for nurses',
    subtitle: 'Trained on clinical language. Understands vitals, medications, and assessments the way you speak them.',
  },
  {
    icon: 'shield',
    color: '#34d399',
    title: 'Your notes stay private',
    subtitle: 'Nothing is stored. Notes clear automatically. No patient data ever leaves your session.',
  },
];

function SlideIcon({ icon, color }) {
  const el = {
    mic:    <Mic    size={44} strokeWidth={1.5} />,
    brain:  <Brain  size={42} strokeWidth={1.5} />,
    shield: <Shield size={44} strokeWidth={1.5} />,
  }[icon];

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer ambient ring */}
      <div
        style={{
          position: 'absolute',
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${color}18 0%, transparent 70%)`,
        }}
      />
      {/* Main orb */}
      <div
        style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 35%, ${color}30 0%, ${color}10 55%, transparent 80%)`,
          border: `1px solid ${color}40`,
          boxShadow: `0 0 0 1px ${color}18, 0 0 48px ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
          position: 'relative',
        }}
      >
        {/* Inner highlight */}
        <span
          style={{
            position: 'absolute', inset: 6, borderRadius: '50%',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -8px 20px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
          }}
        />
        <span style={{ position: 'relative' }}>{el}</span>
      </div>
    </div>
  );
}

export default function ScreenOnboarding({ onComplete }) {
  const [slide,    setSlide]    = useState(0);
  const touchStartX = useRef(null);

  const goTo  = (i) => setSlide(Math.max(0, Math.min(SLIDES.length - 1, i)));
  const next  = () => slide < SLIDES.length - 1 ? goTo(slide + 1) : onComplete();
  const prev  = () => goTo(slide - 1);
  const isLast = slide === SLIDES.length - 1;

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  return (
    <div
      className="screen"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header row */}
      <div
        className="relative z-10 flex items-center justify-between px-5"
        style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))', paddingBottom: 8, minHeight: 56 }}
      >
        <span className="font-mono text-ink-5" style={{ fontSize: 10, letterSpacing: '0.10em' }}>
          {slide + 1} / {SLIDES.length}
        </span>
        {!isLast && (
          <button
            className="btn-ghost"
            onClick={onComplete}
            style={{ padding: '6px 14px', fontSize: 12 }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Slides — absolutely positioned, translate per index */}
      <div className="relative z-10 flex-1" style={{ overflow: 'hidden', position: 'relative' }}>
        {SLIDES.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 36px',
              gap: 32,
              transform: `translateX(${(i - slide) * 100}%)`,
              transition: 'transform 380ms cubic-bezier(0.25,0.46,0.45,0.94)',
              willChange: 'transform',
            }}
          >
            <SlideIcon icon={s.icon} color={s.color} />
            <div className="text-center flex flex-col gap-3">
              <h2
                className="text-ink-1 font-semibold m-0"
                style={{ fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                {s.title}
              </h2>
              <p className="text-ink-3 m-0" style={{ fontSize: 15, lineHeight: 1.65 }}>
                {s.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: dots + CTA */}
      <div
        className="relative z-10 flex flex-col items-center gap-5 px-6"
        style={{ paddingTop: 20, paddingBottom: 'calc(36px + env(safe-area-inset-bottom))' }}
      >
        {/* Progress dots */}
        <div className="flex items-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 99,
                background: i === slide ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                boxShadow: i === slide ? '0 0 10px rgba(34,211,238,0.55)' : 'none',
                transition: 'width 280ms cubic-bezier(0.25,0.46,0.45,0.94), background 280ms, box-shadow 280ms',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          className="btn-primary w-full"
          onClick={next}
          style={{ padding: '16px 20px', borderRadius: 16, fontSize: 15 }}
        >
          {isLast ? 'Get started' : (
            <>Next <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}
