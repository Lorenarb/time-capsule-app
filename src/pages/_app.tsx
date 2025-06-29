// src/pages/_app.tsx (Pages Router)
import { AppProps } from 'next/app'; // For AppProps type
import { Great_Vibes, DM_Sans } from 'next/font/google'; // Import your fonts
import '../styles/globals.css'; // Your global Tailwind CSS file

// Define Great Vibes font
const greatVibes = Great_Vibes({
  weight: '400', // Specify weights if not a variable font
  subsets: ['latin'],
  variable: '--font-great-vibes', // Create a CSS variable
  display: 'swap', // Helps control font loading behavior
});

// Define DM Sans font
const dmSans = DM_Sans({
  weight: ['400', '500', '700'], // Example weights for DM Sans
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${greatVibes.variable} ${dmSans.variable} font-sans`}
      // Apply the CSS variables globally.
      // Tailwind's font-sans will pick up the 'DM Sans' due to the variable.
      // We'll then use var(--font-great-vibes) directly where needed.
    >
      <Component {...pageProps} />
    </main>
  );
}