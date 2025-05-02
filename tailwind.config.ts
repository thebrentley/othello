import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          100: "#CAFB04",
          300: "#62EB99",
          600: "#05BF75",
          700: "#00A064",
          800: "#00794C",
          900: "#015C30",
        },
        gray: {
          100: "#FFFFFF",
          200: "#D8D8D8",
          300: "#ABABAB",
          700: "#3D3D3D",
          800: "#2A2A2A",
          900: "#000000",
        },
      },
      fontFamily: {
        sans: ["Chakra Petch", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
