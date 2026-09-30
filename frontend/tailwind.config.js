/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#123C35',
          50: '#e6f0ee',
          100: '#c0d9d5',
          200: '#96c0b9',
          300: '#6ba79d',
          400: '#4b9488',
          500: '#2b8173',
          600: '#236e62',
          700: '#1a5a50',
          800: '#123C35',
          900: '#0a2e29',
        },
        secondary: {
          DEFAULT: '#1F7A70',
          50: '#e6f4f2',
          100: '#b3ddd8',
          200: '#80c7be',
          300: '#4db0a4',
          400: '#269e91',
          500: '#1F7A70',
          600: '#1a6b63',
          700: '#155c55',
          800: '#104d48',
          900: '#0b3e3a',
        },
        accent: {
          DEFAULT: '#F2B84B',
          50: '#fef8e8',
          100: '#fcedc5',
          200: '#fae09e',
          300: '#f7d377',
          400: '#F2B84B',
          500: '#e8a830',
          600: '#d4931f',
          700: '#b67a18',
          800: '#986212',
          900: '#7a4e0e',
        },
        ivory: '#F7F5EF',
        surface: '#FFFFFF',
        dark: '#172321',
        muted: '#66736F',
        'soft-border': '#E2DFD6',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Plus Jakarta Sans"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(18, 60, 53, 0.06), 0 1px 2px rgba(18, 60, 53, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(18, 60, 53, 0.08), 0 4px 10px -2px rgba(18, 60, 53, 0.04)',
        'elevated': '0 20px 40px -12px rgba(18, 60, 53, 0.12)',
        'glow': '0 0 20px rgba(31, 122, 112, 0.15)',
        'glow-accent': '0 0 20px rgba(242, 184, 75, 0.2)',
      },
      animation: {
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'wave-slow': 'wave 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'path-draw': 'pathDraw 2s ease-out forwards',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        pathDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
