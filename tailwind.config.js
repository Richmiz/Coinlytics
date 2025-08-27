/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
     extend: {
      colors: {
        primary: "#5907CB",
        secondary: "#FF4678",
        tertiary: "#F19ECA",
        quaternary: "#EBE1FA",
        white: {
          DEFAULT:  "#ffffff",
            100: "#fafafa",
            200: "#FE8C00",
        },
        gray: {
          100: "#878787",
        },
        dark: {
          100: "#181c2e",
        },
        expenses: "#F14141",
        income: "#28A71C"

      },
    },
  },
  plugins: [],
}