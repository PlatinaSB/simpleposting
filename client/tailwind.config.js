/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";
import flowbitePlugin from "flowbite/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
};
