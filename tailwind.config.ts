import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          light: "#EEF2FF",
          foreground: "#ffffff",
        },
        background: {
          light: "#F9FAFB",
          dark: "#0F172A",
        },
        card: {
          light: "#FFFFFF",
          dark: "#111827",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px rgba(99,102,241,0.12), 0 2px 6px rgba(0,0,0,0.06)",
        "ai": "0 8px 32px rgba(99,102,241,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: "0", transform: "translateX(-8px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
