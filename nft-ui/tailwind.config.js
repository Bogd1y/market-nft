/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark": "#222831",
        "gray": "#393E46",
        "bluish": "#00ADB5",
        "whiteish": "#EEEEEE",
      }
    },
  },
  plugins: [],
}