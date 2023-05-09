const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff8ff",
          100: "#def1ff",
          200: "#b6e4ff",
          300: "#76d0ff",
          400: "#2db9ff",
          500: "#02a1f5",
          600: "#007fd2",
          700: "#0066aa",
          800: "#005387",
          900: "#074773",
          950: "#042d4d",
        },
        accent: {
          50: "#fef1f6",
          100: "#fee5f0",
          200: "#ffcbe3",
          300: "#ffa1ca",
          400: "#ff5d9f",
          500: "#fa3a83",
          600: "#ea185d",
          700: "#cc0a45",
          800: "#a80c39",
          900: "#8c0f33",
          950: "#560119",
        },
        neutral: colors.stone,
        info: colors.blue,
        success: colors.green,
        warning: colors.yellow,
        danger: colors.red,
      },
    },
  },
  plugins: [],
};
