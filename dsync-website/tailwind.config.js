/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dsync: {
          bg: '#050508',
          card: '#0c0c12',
          orange: '#F97316',
          teal: '#14B8A6',
          silver: '#94a3b8',
          light: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      animation: {
        'stagger-in': 'staggerIn 0.6s ease-out forwards',
      },
      keyframes: {
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
