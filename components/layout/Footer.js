"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { images } from "@/lib/images";
export default function Footer() {
  const { t, language } = useLanguage();
  const label = (value) => localizeLabel(value, language);
  return (
    <footer className="bg-palm-deep text-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-1">
          <div className="inline-flex w-fit items-center justify-center rounded-2xl bg-cream p-2.5 mb-4">
            <Image
              src={images.logo}
              alt={t("palmLeafHouseArchive")}
              sizes="(max-width: 640px) 120px, 160px"
              className="h-12 w-auto sm:h-14"
            />
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
                href="/about"
              >
                {t("aboutThisArchive")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">
            {t("communityArchive")}
          </h3>
          <p className="text-sm text-cream/75 leading-relaxed">
            {t("builtWith")}
          </p>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <p>
            &copy; {new Date().getFullYear()} {label("Traditional Palm-Leaf House Covering Techniques")}
          </p>
          <p>{t("communityArchive")}</p>
        </div>
      </div>
    </footer>
  );
}
