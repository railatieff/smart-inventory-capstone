// smart-inventory/frontend/pages/_app.js

/**
 * This is the custom App component for Next.js.
 * Next.js uses this file to initialize all pages.
 *
 * This is the *only* correct file to import global CSS styles.
 * We import our global styles here so they apply to the entire application.
 */
import "../styles/globals.css";

/**
 * The default function renders the active page component.
 * @param {object} Component - The page component being rendered.
 * @param {object} pageProps - The props for that page.
 */
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
