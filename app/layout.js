import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/components/common/LanguageProvider";
import "./globals.css";

/**
 * Fonts are self-hosted.
 *
 * The four families used by the design (Fraunces, Work Sans, IBM Plex Mono and
 * Noto Sans Khmer) are loaded with `@font-face` from `public/fonts/` instead of
 * `next/font/google`. That removes every network request from the build and
 * from `next dev`, which previously failed on a Turbopack font-CSS
 * resolution error, and it keeps Khmer text rendering even offline.
 */
export const metadata = {
  title:
    "Traditional Palm-Leaf House Covering Techniques | A Community Cultural Archive",
  description:
    "A digital archive preserving the knowledge, skills, and stories behind traditional palm-leaf house covering techniques, documented directly from community elders.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="flex min-h-dvh flex-col antialiased bg-cream text-ink"
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
