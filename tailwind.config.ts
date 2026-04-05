import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090b0f",
        panel: "#10131a",
        panelSoft: "#151922",
        borderSubtle: "#232834",
        silver: "#d7dde8",
        electric: "#5f9dff"
      },
      boxShadow: {
        panel: "0 10px 40px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35)"
      },
      borderRadius: {
        premium: "18px"
      }
    }
  },
  plugins: []
};

export default config;
