// config/tailwind.config.js
// Tailwind CSS configuration

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "../src/**/*.{js,jsx,ts,tsx}",
    "../docs/**/*.{md,mdx}",
    "../blog/**/*.{md,mdx}",
  ],
  
  theme: {
    extend: {
      // Custom theme extensions
      colors: {
        // Equilibria brand colors (if needed for Tailwind classes)
        'equilibria-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#003B7E', // Primary brand color
        },
      },
      
      fontFamily: {
        // Custom fonts if needed
        // 'virgil': ['Virgil', 'cursive'],
      },
      
      spacing: {
        // Custom spacing if needed
        // '18': '4.5rem',
        // '88': '22rem',
      },
      
      animation: {
        // Custom animations if needed
        // 'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  
  plugins: [
    require('@tailwindcss/typography'),
    // Add more Tailwind plugins here as needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
  
  // Dark mode configuration
  darkMode: ['class', '[data-theme="dark"]'],
  
  // Future configurations
  // corePlugins: {
  //   preflight: false, // Disable if conflicts with Docusaurus
  // },
};

module.exports = tailwindConfig;
