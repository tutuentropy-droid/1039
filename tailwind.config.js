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
        'indigo-cn': 'var(--color-indigo)',
        cinnabar: 'var(--color-cinnabar)',
        azurite: 'var(--color-azurite)',
        jade: 'var(--color-jade)',
        gold: 'var(--color-gold)',
        vermilion: 'var(--color-cinnabar)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
