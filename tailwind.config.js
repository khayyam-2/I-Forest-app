/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'arabic': ['Amiri', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-100',
    'bg-green-100',
    'bg-emerald-100',
    'bg-purple-100',
    'bg-yellow-100',
    'text-blue-600',
    'text-green-600',
    'text-emerald-600',
    'text-purple-600',
    'text-yellow-600',
  ]
};