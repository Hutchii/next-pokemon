/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Manrope", "sans-serif"],
    },
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(150px, 1fr))',
      }
    },
    screens: {
      "sm": "480px",
      "md": "600px",
      "md2.5": "768px",
      "md2": "900px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1440px",
      "3xl": "1680px",
    }
  },
  plugins: [],
};
