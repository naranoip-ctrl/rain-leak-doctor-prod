import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          dark: '#0A2540',
          light: '#1a6bb5',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dark: '#00b8d9',
          light: '#33ddff',
        },
        cta: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          light: '#FF8555',
        },
        warning: {
          DEFAULT: '#E63946',
          dark: '#C5303C',
          light: '#FF4D5A',
        },
        line: {
          DEFAULT: '#06C755',
          dark: '#05b54c',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      keyframes: {
        'pulse-cta': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 35px rgba(255, 107, 53, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-cta': 'pulse-cta 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
