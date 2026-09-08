import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmacy: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#00A86B", /* Core brand green */
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          teal: "#00A896",
          dark: "#0B2545", /* Dark petroleum for corporate touches */
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          surface: "var(--primary-surface)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
          light: "var(--secondary-light)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          light: "var(--accent-light)",
        },
        promo: {
          DEFAULT: "var(--promo)",
          light: "var(--promo-light)",
        },
        corporate: {
          DEFAULT: "var(--corporate)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        "pharmacy-sm": "0 1px 3px 0 rgba(0, 168, 107, 0.08), 0 1px 2px -1px rgba(0, 168, 107, 0.04)",
        "pharmacy": "0 4px 14px -2px rgba(0, 168, 107, 0.1), 0 2px 6px -2px rgba(0, 168, 107, 0.05)",
        "pharmacy-lg": "0 12px 28px -4px rgba(0, 168, 107, 0.14), 0 4px 10px -3px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
