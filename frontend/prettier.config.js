module.exports = {
  arrowParens: "avoid",
  tabWidth: 2,
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tailwindConfig: "./tailwind.config.js",
  plugins: [require("prettier-plugin-tailwindcss")],
};
