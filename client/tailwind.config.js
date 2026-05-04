/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-green-deep": "var(--brand-green-deep)",
        "brand-green": "var(--brand-green)",
        "brand-gold": "var(--brand-gold)",
        "brand-cream": "var(--brand-cream)",
        "brand-terracotta": "var(--brand-terracotta)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-gold": "var(--gradient-gold)",
        "gradient-warm": "var(--gradient-warm)",
      },
      boxShadow: {
        warm: "var(--shadow-warm)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['Inter', "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "none" },
        },
        "steam-rise": {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "0",
          },
          "15%": { opacity: "0.55" },
          "50%": {
            transform: "translateY(-120px) translateX(-15px) scale(1.6)",
            opacity: "0.35",
          },
          "100%": {
            transform: "translateY(-260px) translateX(20px) scale(2.4)",
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out both",
        "steam-rise": "steam-rise 5s ease-in infinite",
      },
    },
  },
  plugins: [],
};
