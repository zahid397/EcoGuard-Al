/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // safe fallback
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // blue-600
        danger: "#dc2626",  // red-600
        success: "#16a34a", // green-600
      },
    },
  },
  plugins: [],
};
