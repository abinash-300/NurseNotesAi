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
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'mic-glow': {
          '0%, 100%': { boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' },
          '50%':      { boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), 0 0 0 10px rgba(6,182,212,0.14)' },
        },
        'slide-from-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-from-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-down-in': {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0)',    opacity: '0' },
          '60%':  { transform: 'scale(1.18)'               },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'indeterminate': {
          '0%':   { left: '-35%',  right: '100%' },
          '60%':  { left: '100%',  right: '-90%' },
          '100%': { left: '100%',  right: '-90%' },
        },
      },
      animation: {
        'pulse-dot':        'pulse-dot 1.4s ease-in-out infinite',
        'rise-in':          'rise-in 300ms ease-out both',
        'mic-breathe':      'mic-breathe 2.5s ease-in-out infinite',
        'slow-spin':        'slow-spin 8s linear infinite',
        'slide-up':         'slide-up 260ms cubic-bezier(0.32,0.72,0,1) both',
        'shimmer':          'shimmer 1.5s ease-in-out infinite',
        'mic-glow':         'mic-glow 2.5s ease-in-out infinite',
        'slide-from-right': 'slide-from-right 220ms ease-out both',
        'slide-from-left':  'slide-from-left 220ms ease-out both',
        'slide-down-in':    'slide-down-in 280ms cubic-bezier(0.22,1,0.36,1) both',
        'scale-in':         'scale-in 320ms cubic-bezier(0.34,1.56,0.64,1) both',
        'indeterminate':    'indeterminate 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
