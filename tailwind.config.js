/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        ochre: 'var(--color-ochre)',
        indigo: 'var(--color-indigo)',
        cinnabar: 'var(--color-cinnabar)',
        azurite: 'var(--color-azurite)',
        jade: 'var(--color-jade)',
        gold: 'var(--color-gold)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
    },
  },
  plugins: [],
};
