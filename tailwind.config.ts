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
          DEFAULT: '#24483F',
          dark: '#18372F',
          light: '#42665A',
        },
        accent: {
          DEFAULT: '#CFDCC5',
          dark: '#35634F',
          light: '#E6ECDC',
        },
        cta: {
          DEFAULT: '#35634F',
          dark: '#284D3E',
          light: '#CFDCC5',
        },
        warning: {
          DEFAULT: '#95532C',
          dark: '#78401F',
          light: '#E8C9A6',
        },
        line: {
          DEFAULT: '#06C755',
          dark: '#05b54c',
        },
      },
      fontFamily: {
        serif: ['var(--font-editorial)', 'Yu Mincho', 'serif'],
        sans: [
          'var(--font-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Yu Gothic"',
          '"Hiragino Kaku Gothic ProN"',
          'Meiryo',
          'sans-serif',
        ],
      },
      keyframes: {
        'pulse-cta': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: 'none' },
          '50%': { transform: 'scale(1.03)', boxShadow: 'none' },
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
