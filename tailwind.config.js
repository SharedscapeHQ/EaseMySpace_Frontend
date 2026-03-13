/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    animation: {
      scroll: "scroll 35s linear infinite",
      "scroll-reverse": "scrollReverse 30s linear infinite",
    },
    keyframes: {
      scroll: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      scrollReverse: { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
    },
    // ADD THIS:
    animationPlayState: {
      pause: "paused",
      run: "running",
    },
  },
},
plugins: [
  function ({ addUtilities }) {
    addUtilities({
      ".pause": { "animation-play-state": "paused" },
      ".running": { "animation-play-state": "running" },
    });
  },
],
}
