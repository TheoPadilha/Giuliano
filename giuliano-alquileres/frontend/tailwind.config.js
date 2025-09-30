/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // NOVA PALETA VERMELHA - Tema Principal
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Vermelho principal
          600: "#dc2626", // Vermelho mais escuro (hover)
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // Vermelho vibrante para destaques
        accent: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e", // Rosa-vermelho vibrante
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        // Cinzas neutros
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        "gradient-accent": "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
      },
      boxShadow: {
        "red-glow": "0 0 20px rgba(220, 38, 38, 0.3)",
        "red-strong": "0 10px 40px -4px rgba(220, 38, 38, 0.4)",
      },
    },
  },
  plugins: [],
};
