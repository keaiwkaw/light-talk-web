const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./public/index.html", "./src/**/*.{js,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      gray: colors.coolGray,
      blue: colors.sky,
      red: colors.rose,
      pink: colors.fuchsia,
      yellow: colors.amber,
      green: colors.emerald,
      purple: colors.violet,
      indigo: colors.indigo,
      primary: "#374151",
      aside: "#2e2e2e",
      white:'#ecf0f1'
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
