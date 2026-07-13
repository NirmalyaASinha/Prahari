/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          950: '#030712',
          900: '#0f172a',
          850: '#152033',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'scanning': 'scanning 2s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(56, 189, 248, 0.2)', boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)' },
          '50%': { borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanning: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        }
      },
    },
  },
  plugins: [],
}
