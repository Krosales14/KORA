import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kora: {
          blue: "#2563eb",
          dark: "#020617",
          glow: "#3b82f6",
          panel: "#0f172a",
          soft: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};

export default config;