/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-1000': '#02050e',
        'navy-950':  '#050a1a',
        'navy-900':  '#08102a',
        'navy-850':  '#0c1530',
        'navy-800':  '#11203f',
        'navy-700':  '#1a2c52',
        'ink-1': '#f4f7ff',
        'ink-2': '#c8d3ed',
        'ink-3': '#8a99c2',
        'ink-4': '#5f6e96',
        'ink-5': '#3f4a6e',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan-sm': '0 0 0 1px rgba(0,212,255,0.20), 0 4px 16px rgba(0,212,255,0.12)',
        'glow-cyan-md': '0 0 0 1px rgba(0,212,255,0.30), 0 8px 32px rgba(0,212,255,0.22)',
        'glow-cyan-lg': '0 0 0 1px rgba(0,212,255,0.40), 0 16px 64px rgba(0,212,255,0.30)',
        'glow-red-md':  '0 0 0 1px rgba(248,113,113,0.30), 0 8px 32px rgba(239,68,68,0.22)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'mic-glow': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(0,212,255,0.35), 0 0 80px rgba(0,212,255,0.12)' },
          '50%':       { boxShadow: '0 0 65px rgba(0,212,255,0.60), 0 0 130px rgba(0,212,255,0.25)' },
        },
        'mic-glow-red': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(248,113,113,0.40), 0 0 80px rgba(248,113,113,0.15)' },
          '50%':       { boxShadow: '0 0 65px rgba(248,113,113,0.65), 0 0 130px rgba(248,113,113,0.28)' },
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
