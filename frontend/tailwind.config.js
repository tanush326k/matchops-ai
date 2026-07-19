/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          bg: "#020617",
          card: "rgba(15, 23, 42, 0.45)",
          cardSolid: "#0f172a",
          border: "rgba(255, 255, 255, 0.05)",
          borderGlow: "rgba(59, 130, 246, 0.25)",
        }
      },
      animation: {
        "pulse-ring": "pulse-ring 2.5s infinite ease-in-out",
        "fade-in": "fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        marquee: "marquee 35s linear infinite",
      },
    },
  },
  plugins: [],
}
