/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: ['class', '[data-theme="dark"]'],
};
