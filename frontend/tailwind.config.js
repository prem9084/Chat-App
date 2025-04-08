/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // Make sure it's properly added
  ],
  daisyui: {
    logs: false, // Disable DaisyUI logs in case they cause issues
  },
};
