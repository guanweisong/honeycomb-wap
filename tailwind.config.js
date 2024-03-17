/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        lg: '700px',
        xl: '1000px',
      },
    },
    extend: {
      borderWidth: {
        0.5: 0.5,
      },
      colors: {
        'auto-front-gray': 'rgba(var(--auto-front-gray) / <alpha-value>)',
        'auto-back-gray': 'rgba(var(--auto-back-gray) / <alpha-value>)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
