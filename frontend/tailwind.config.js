/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F7',
          100: '#FFE1EF',
          200: '#FFB8D9',
          300: '#FF8FC3',
          400: '#FF66AD',
          500: '#FF3D97',
          600: '#FF147B',
          700: '#EB0065',
          800: '#C3004F',
          900: '#9B003F',
        },
        secondary: {
          50: '#F7F8FC',
          100: '#EDF0F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#FFF8FA',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Playfair Display', 'serif'],
        accent: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
}; 