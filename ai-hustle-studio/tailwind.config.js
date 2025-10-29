/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.css",
  ],
  darkMode: 'class', // enable dark mode using a class on <html> or <body>
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // blue
        secondary: '#10b981', // green
        warning: '#f59e0b', // yellow
        danger: '#ef4444', // red
        bgLight: '#f9fafb',
        bgDark: '#111827',
        textLight: '#111827',
        textDark: '#f9fafb',
      },
      fontFamily: {
        mono: ['ui-monospace', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
