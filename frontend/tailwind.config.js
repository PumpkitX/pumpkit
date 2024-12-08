/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          dark: '#1e3a8a',
        },
        background: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        }
      }
    },
  },
  plugins: [],
};