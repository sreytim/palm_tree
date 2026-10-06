"use client";
import Image from "next/image";
import { images } from "@/lib/images";
import { useLanguage } from "./LanguageProvider";
export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden weave-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-10 sm:pt-14 pb-6 sm:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-5">
            {t("communityArchive")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] font-medium text-ink text-balance">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-xl">
            {t("preserving")}
          </p>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 relative">
          <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-25px_rgba(43,36,23,0.45)]">
            <Image
              src={images.heroHouse}
              alt="Traditional palm-leaf house covering techniques"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/40 via-transparent to-transparent" />
          </div>
          <div className="hidden sm:block absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl overflow-hidden border-4 border-cream shadow-xl rotate-[-6deg]">
            <Image
              src={images.heroTexture}
              alt="Close-up texture of woven palm leaves"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
