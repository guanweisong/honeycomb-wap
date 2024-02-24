/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '800px',
        lg: '800px',
        xl: '800px',
      },
    },
    extend: {
      borderWidth: {
        0.5: 0.5,
      },
      colors: {
        'auto-front-gray': 'rgba(var(--auto-front-gray))',
        'auto-back-gray': 'rgba(var(--auto-back-gray))',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
