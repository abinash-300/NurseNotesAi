/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink-1': '#111827',
        'ink-2': '#374151',
        'ink-3': '#6B7280',
        'ink-4': '#9CA3AF',
        'ink-5': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan-sm': '0 0 0 1px rgba(6,182,212,0.15), 0 4px 12px rgba(6,182,212,0.10)',
        'glow-cyan-md': '0 0 0 1px rgba(6,182,212,0.20), 0 8px 24px rgba(6,182,212,0.12)',
        'glow-cyan-lg': '0 0 0 1px rgba(6,182,212,0.25), 0 16px 48px rgba(6,182,212,0.15)',
        'glow-red-md':  '0 0 0 1px rgba(239,68,68,0.20), 0 8px 24px rgba(239,68,68,0.15)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'mic-glow': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(6,182,212,0.20), 0 0 80px rgba(6,182,212,0.08)' },
          '50%':       { boxShadow: '0 0 55px rgba(6,182,212,0.35), 0 0 100px rgba(6,182,212,0.14)' },
        },
        'mic-glow-red': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(239,68,68,0.25), 0 0 80px rgba(239,68,68,0.10)' },
          '50%':       { boxShadow: '0 0 55px rgba(239,68,68,0.40), 0 0 100px rgba(239,68,68,0.16)' },
        },
        'rise-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot':    'pulse-dot 1.4s ease-in-out infinite',
        'mic-glow':     'mic-glow 2.6s ease-in-out infinite',
        'mic-glow-red': 'mic-glow-red 1.8s ease-in-out infinite',
        'rise-in':      'rise-in 450ms cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
