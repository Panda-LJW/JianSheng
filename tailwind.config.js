/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        museum: {
          deep: '#0D0B09',
          primary: '#1A1611',
          secondary: '#2A2318',
          elevated: '#3D352A',
          ivory: '#E8DFD0',
          secondaryText: '#A89A87',
          muted: '#8B7D6B',
          dim: '#5A4E3E',
          gold: '#C69B49',
          cinnabar: '#8B3A2E',
        },
      },
    },
  },
  plugins: [],
}
