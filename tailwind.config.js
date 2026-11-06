/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#141E33',
          900: '#0F172A',
          950: '#090E1A',
        },
        coral: {
          50: '#FFF5F4',
          100: '#FFEBEA',
          200: '#FFD6D3',
          300: '#FFAFA9',
          400: '#FF8278',
          500: '#FF6358', // Vivid coral accent
          600: '#EA4C41',
          700: '#C7362C',
          800: '#A42E27',
          900: '#872C26',
        },
        cream: {
          25: '#FFFEFA',
          50: '#FAF8F5', // Soft light cream background
          100: '#F5F1E9',
          200: '#EAE2D5',
          300: '#DDD2C0',
          400: '#C7B79E',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'glow-coral': '0 4px 20px -2px rgba(255, 99, 88, 0.25)',
      }
    },
  },
  plugins: [],
}

