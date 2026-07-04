/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        phoenix: {
          orange: '#FF6A00',
          dark: '#070A0F',
          graphite: '#111722',
          border: 'rgba(255, 106, 0, 0.15)',
        }
      }
    },
  },
  plugins: [],
};
