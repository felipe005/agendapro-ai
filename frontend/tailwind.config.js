/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf5",
          100: "#d5f6e5",
          200: "#aeeccf",
          300: "#7ddeaf",
          400: "#45ca89",
          500: "#22b56c",
          600: "#179257",
          700: "#147447",
          800: "#145c3c",
          900: "#124c33"
        }
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

