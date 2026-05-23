import { useMemo } from 'react';

export default function Waveform({ active, count = 48, color = '#f87171', height = 56 }) {
  const bars = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const seed   = (Math.sin(i * 1.7) + 1) / 2;
      return {
        duration: 0.7 + seed * 0.6,
        delay:    (i % 12) * 0.08,
        opacity:  0.4 + seed * 0.6,
      };
    }),
  [count]);

  return (
    <div className="flex items-center justify-center" style={{ gap: 3, height }}>
      {bars.map((bar, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: 3,
            height,
            background: `linear-gradient(180deg, ${color}, ${color}88)`,
            borderRadius: 3,
            transformOrigin: 'center',
            transform: active ? undefined : 'scaleY(0.08)',
            animation: active
              ? `wave-bar ${bar.duration}s ease-in-out ${bar.delay}s infinite`
              : 'none',
            opacity: active ? bar.opacity : 0.2,
          }}
        />
      ))}
    </div>
  );
}
