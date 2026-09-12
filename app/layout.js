import { Fraunces, Work_Sans, IBM_Plex_Mono, Noto_Sans_Khmer, } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageProvider from "@/components/LanguageProvider";
import "./globals.css";
const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
    axes: ["opsz", "SOFT", "WONK"],
    weight: "variable",
    style: ["normal", "italic"],
});
const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    subsets: ["latin"],
    weight: ["400", "500"],
});
const notoSansKhmer = Noto_Sans_Khmer({
    variable: "--font-khmer",
    subsets: ["khmer"],
    weight: ["400", "500", "600", "700"],
});
export const metadata = {
    title: "Traditional Palm-Leaf House Covering Techniques | A Community Cultural Archive",
    description: "A digital archive preserving the knowledge, skills, and stories behind traditional palm-leaf house covering techniques, documented directly from community elders.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} ${notoSansKhmer.variable} antialiased bg-cream text-ink`}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>);
}
