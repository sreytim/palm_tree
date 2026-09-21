"use client";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useLanguage } from "../common/LanguageProvider";
const categories = [
  "Palm Leaf Preparation",
  "Weaving Techniques",
  "House Construction",
  "Attachment Techniques",
  "Maintenance & Repair",
  "Personal Stories",
];
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-palm-deep text-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-palm-deep">
              <Leaf size={18} />
            </span>
            <span className="font-display text-lg">
              Palm-Leaf House Archive
            </span>
          </div>
          <p className="text-sm text-cream/75 leading-relaxed">
            {t("preservingOne")}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">
            {t("navigate")}
          </h3>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>
              <Link className="hover:text-cream transition-colors" href="/">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-cream transition-colors"
                href="/techniques"
              >
                {t("techniques")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-cream transition-colors"
                href="/stories"
              >
                {t("stories")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-cream transition-colors"
                href="/about"
              >
                {t("aboutThisArchive")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">
            {t("categories")}
          </h3>
          <ul className="space-y-2 text-sm text-cream/80">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/?category=${encodeURIComponent(cat)}#archive`}
                  className="hover:text-cream transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">
            A Community Cultural Archive
          </h3>
          <p className="text-sm text-cream/75 leading-relaxed">
            {t("builtWith")}
          </p>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <p>
            &copy; {new Date().getFullYear()} Traditional Palm-Leaf House
            Covering Techniques.
          </p>
          <p>A Community Cultural Archive</p>
        </div>
      </div>
    </footer>
  );
}
