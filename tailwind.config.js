/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'zoho-navy': '#003366', // Deep navy blue for primary elements
        'zoho-blue': '#007DB8', // Sky blue for accents and buttons
        'zoho-gray': '#F5F7FA', // Light gray for backgrounds
        'zoho-dark-gray': '#333333', // Dark gray for text and borders
      }
    }
  },
  plugins: [],
  darkMode: 'class'
};