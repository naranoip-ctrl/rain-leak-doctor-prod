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
          DEFAULT: '#12364A',
          dark: '#0A2431',
          light: '#2E6477',
        },
        accent: {
          DEFAULT: '#49D4D0',
          dark: '#0F9F9A',
          light: '#8BE7E3',
        },
        cta: {
          DEFAULT: '#0F9F9A',
          dark: '#0A817E',
          light: '#49D4D0',
        },
        warning: {
          DEFAULT: '#C96B2C',
          dark: '#A5521E',
          light: '#F3A35E',
        },
        line: {
          DEFAULT: '#06C755',
          dark: '#05b54c',
        },
      },
      fontFamily: {
        sans: [
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
