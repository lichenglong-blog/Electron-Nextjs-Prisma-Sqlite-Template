/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan': 'scan 4s ease-in-out infinite',
        'pulse': 'pulse 2s infinite alternate ease-in-out',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%': { transform: 'scale(1)', opacity: 0.5 },
          '100%': { transform: 'scale(1.05)', opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
} 