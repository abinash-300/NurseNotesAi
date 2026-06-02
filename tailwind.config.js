/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'apple-bg':    '#F2F2F7',
        'apple-card':  '#FFFFFF',
        'apple-label': '#000000',
        'apple-2':     '#8E8E93',
        'apple-3':     '#C7C7CC',
        'apple-sep':   '#C6C6C8',
        'brand':       '#06B6D4',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'SF Pro Display'", "'SF Pro Text'", 'system-ui', 'sans-serif'],
        mono: ["'SF Mono'", "'DM Mono'", 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'apple': '20px',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.08)',
        'card-md': '0 2px 8px rgba(0,0,0,0.10)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'rise-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'mic-breathe': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '1'   },
          '50%':       { transform: 'scale(1.08)', opacity: '0.55' },
        },
        'slow-spin': {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'pulse-dot':   'pulse-dot 1.4s ease-in-out infinite',
        'rise-in':     'rise-in 300ms ease-out both',
        'mic-breathe': 'mic-breathe 2.5s ease-in-out infinite',
        'slow-spin':   'slow-spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
