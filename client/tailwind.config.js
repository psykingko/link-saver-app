/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // enable class strategy
  theme: {
    extend: {
      colors: {
        brand: {
          lightBg: "#CAF0F8",
          lightCard: "#90E0EF",
          lightAccent: "#0077B6",
          lightAccent2: "#00B4D8",
          lightText: "#FFFFFF",

          darkBg: "#03045E",
          darkCard: "#023E8A",
          darkAccent: "#00B4D8",
          darkAccent2: "#90E0EF",
          darkText: "#000000",
        },
      },
    },
  },
  plugins: [],
};
