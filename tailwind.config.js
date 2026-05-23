/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        museum: {
          ink: '#0D0B09',
          panel: '#1A1611',
          ivory: '#E8DFD0',
          muted: '#A89A87',
          dim: '#5A4E3E',
          gold: '#C69B49',
        },
      },
    },
  },
  plugins: [],
}
