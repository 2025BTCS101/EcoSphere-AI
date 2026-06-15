/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090D16',
        darkCard: 'rgba(17, 25, 40, 0.75)',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        emeraldGlow: '#059669',
        brandGreen: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        brandBlue: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
}
