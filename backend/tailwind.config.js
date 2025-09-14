/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'learning-bg': '#FFFFE7',
        'learning-card': '#F5F5DC',
        'learning-accent': '#E89228',
        'learning-green': '#ADCF36',
        'learning-dark-green': '#A7CA4D',
        'learning-gold': '#F0C022',
        'learning-code-bg': '#272723',
        'learning-code-text': '#E2C154',
        'learning-border': '#000000',
      },
      fontFamily: {
        'code': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}