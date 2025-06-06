/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f8f6',
          100: '#e3eae3',
          200: '#c7d5c7',
          300: '#a1b9a1',
          400: '#759975',
          500: '#5a7f5a',
          600: '#4a6b4a',
          700: '#3d563d',
          800: '#334533',
          900: '#2a382a',
        },
        warmBlue: {
          500: '#0891ff',
          600: '#0074e6',
        },
        success: {
          500: '#22c522',
        },
        earth: {
          600: '#a07746',
        }
      }
    },
  },
  plugins: [],
}