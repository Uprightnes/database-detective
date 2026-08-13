/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Special Elite"', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: '#1a1a1a',
        paper: '#f2ede4',
        manila: '#e8dfc8',
        aged: '#c9b99a',
        stamp: '#8b3a2a',
        badge: '#c8a84b',
        muted: '#6b6255',
        wire: '#4a7fa5',
        solved: '#3a6b45',
        danger: '#8b2a2a',
      },
    },
  },
  plugins: [],
};
