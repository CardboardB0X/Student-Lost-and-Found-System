/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fluent: {
          brand: "#0F6CBD",
          brandHover: "#115EA3",
          brandPressed: "#0C3B5E",
          brandBackground: "#EBF3FC",
          neutralBg1: "#FFFFFF",
          neutralBg2: "#FAFAFA",
          neutralBg3: "#F5F5F5",
          neutralStroke1: "#D1D1D1",
          neutralStroke2: "#E0E0E0",
          neutralDark: "#242424",
          neutralSecondary: "#616161",
          subtle: "#707070"
        }
      },
      fontFamily: {
        fluent: ["Segoe UI", "-apple-system", "BlinkMacSystemFont", "Roboto", "Helvetica Neue", "sans-serif"]
      },
      boxShadow: {
        fluentCard: "0px 2px 4px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06)",
        fluentElevation: "0px 4px 8px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.06)",
        fluentFlyout: "0px 8px 16px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12)"
      }
    },
  },
  plugins: [],
};
