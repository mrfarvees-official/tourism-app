/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        nav: "rgb(var(--nav) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        hover: "rgb(var(--hover) / <alpha-value>)",
        hover_text: "rgb(var(--hover_text) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        menu: "rgb(var(--menu) / <alpha-value>)",
        icons: "rgb(var(--icons) / <alpha-value>)",
        content: "rgb(var(--content) / <alpha-value>)",
        title: "rgb(var(--title) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        button: "rgb(var(--button) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        toast: "rgb(var(--toast) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        success: "rbg(var(--success) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      borderRadius: {
        brand: "var(--radius)",
      },
    },
  },
  plugins: [],
};
