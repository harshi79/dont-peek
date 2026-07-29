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
        blood: {
          black: "#070506",
          dark: "#0d080a",
          charcoal: "#140b0e",
          card: "#160a0e",
          surface: "#1c0e13",
          border: "#3a131b",
          borderLight: "rgba(138, 18, 38, 0.4)",
          muted: "#8c7a80",
        },
        crimson: {
          400: "#ff2a4b",
          500: "#e61938",
          600: "#b81432",
          700: "#8a1226",
          800: "#5c0b19",
          900: "#3a060e",
          950: "#1f0307",
        },
      },
      boxShadow: {
        "crimson-sm": "0 0 15px rgba(184, 20, 50, 0.15)",
        "crimson-md": "0 0 35px rgba(184, 20, 50, 0.25)",
        "crimson-lg": "0 0 60px rgba(230, 25, 56, 0.35)",
        "crimson-glow": "0 0 25px rgba(230, 25, 56, 0.45)",
      },
      backgroundImage: {
        "blood-moon-radial":
          "radial-gradient(circle at 50% 15%, rgba(184, 20, 50, 0.18) 0%, rgba(92, 11, 25, 0.08) 35%, rgba(7, 5, 6, 0) 70%)",
        "crimson-gradient":
          "linear-gradient(135deg, #e61938 0%, #8a1226 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
