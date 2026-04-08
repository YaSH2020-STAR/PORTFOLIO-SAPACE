/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon': '#b0ff12',
        'dark': '#000000',
        'gray-dark': '#333333',
        'gray-light': '#CCCCCC',
        /* Portfolio: BMW gloss gray / space */
        'space': '#06060a',
        'space-lighter': '#0c0c12',
        'gloss': '#1a1a20',
        'gloss-mid': '#2a2a32',
        'graphite': '#3d3d45',
        'silver': '#a8a8b0',
        'silver-light': '#e0e0e8',
        'glow-blue': '#4a6cf7',
        'glow-violet': '#8b5cf6',
        'dsync-orange': '#F97316',
        'dsync-teal': '#14B8A6',
        /* Mechanical Gen Z portfolio */
        'mech-bg': '#050508',
        'mech-card': '#0d0d12',
        'mech-border': '#1e1e26',
        'mech-graphite': '#3d3d45',
        'mech-silver': '#a8a8b2',
        'mech-cyan': '#22d3ee',
        'mech-orange': '#fb923c',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'display': ['Syne', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
        'typewriter': ['"Courier Prime"', 'Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'caret-blink': 'caretBlink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'starfield': 'radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 40px 70px, rgba(255,255,255,0.25), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent)',
      },
    },
  },
  plugins: [],
};