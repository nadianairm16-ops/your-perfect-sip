import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f7efe5',
        latte: '#d9c1ad',
        mocha: '#8d6e63',
        sage: '#9caf88',
        blush: '#d8a59d',
        coffee: '#5c3a2e',
        parchment: '#f2e4d9',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(92, 58, 46, 0.14)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
