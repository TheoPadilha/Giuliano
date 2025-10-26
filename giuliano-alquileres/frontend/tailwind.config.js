/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Airbnb Rausch (Coral/Rosa) - Cor de Marca Principal
        rausch: {
          DEFAULT: "#FF385C",
          light: "#FF5A5F",
          dark: "#E61E4D",
        },
        // Paleta de Cinzas do Airbnb
        airbnb: {
          black: "#222222",
          foggy: "#6A6A6A",
          grey: {
            50: "#F7F7F7",
            100: "#EBEBEB",
            200: "#DDDDDD",
            300: "#B0B0B0",
            400: "#717171",
            500: "#484848",
            1000: "#222222",
          },
          blue: "#428BFF",
          error: "#C13515",
          success: "#008A05",
          warning: "#E07912",
        },
        // Tema Vermelho Legado (para compatibilidade)
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        accent: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      fontFamily: {
        sans: [
          "Circular",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'tiny': '4px',
        'small': '8px',
        'medium': '12px',
        'large': '16px',
        'xlarge': '20px',
        'xxlarge': '24px',
        'xxxlarge': '32px',
      },
      boxShadow: {
        'elevation-high': '0 8px 28px rgba(0,0,0,0.28)',
        'elevation-primary': '0 6px 20px rgba(0,0,0,0.2)',
        'elevation-secondary': '0 6px 16px rgba(0,0,0,0.12)',
        'elevation-tertiary': '0 2px 4px rgba(0,0,0,0.18)',
        'elevation-3': '0px 0px 0px 1px rgba(0,0,0,0.02), 0px 8px 24px 0px rgba(0,0,0,0.10)',
        'red-glow': '0 0 20px rgba(220, 38, 38, 0.3)',
        'red-strong': '0 10px 40px -4px rgba(220, 38, 38, 0.4)',
      },
      maxWidth: {
        '2520': '2520px',
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '15': '3.75rem', // 60px
        '18': '4.5rem', // 72px
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'enter': 'cubic-bezier(0.1, 0.9, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      animation: {
        'shimmer': 'shimmer 1.3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
