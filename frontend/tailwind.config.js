/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        friction: {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#ef4444',
          critical: '#9333ea',
        },
        dark: {
          bg: '#0b0f17',
          card: '#131b2e',
          border: '#1e293b',
          hover: '#1c283e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
