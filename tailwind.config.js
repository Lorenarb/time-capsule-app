/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme'); // Import default font families for fallbacks

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Required: Tells Tailwind where to scan for classes
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Add this if you are using Next.js App Router
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define your custom font families here.
        // The first string is the CSS variable name that next/font/google creates.
        // The fallback array (`...fontFamily.serif` or `...fontFamily.sans`) is good practice.
        'great-vibes': ['var(--font-great-vibes)', ...fontFamily.serif],
        'dm-sans': ['var(--font-dm-sans)', ...fontFamily.sans],

        // OPTIONAL BUT RECOMMENDED for global base font:
        // If you want 'DM Sans' to be your default sans-serif font throughout the app,
        // you can override Tailwind's built-in 'sans' key directly.
        // This means any element with `font-sans` will automatically use DM Sans.
        sans: ['var(--font-dm-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};