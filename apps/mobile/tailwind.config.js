const sharedPreset = require("@repo/theme/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [sharedPreset],
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
        "../../packages/screens/src/**/*.{js,jsx,ts,tsx}",
    ],
};
