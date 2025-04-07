/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./web/**/*.{js,ts,jsx,tsx}",
      "./native/**/*.{js,ts,jsx,tsx}",
      "./shared/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#0066ff',
            dark: '#004dcc',
          },
        },
      },
    },
    plugins: [],
  };
  