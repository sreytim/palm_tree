"use client";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Leaf, ArrowRight } from "lucide-react";
import Hero from "@/components/common/Hero";
import SectionHeading from "@/components/common/SectionHeading";
import WeaveDivider from "@/components/common/WeaveDivider";
import FadeIn from "@/components/common/FadeIn";
import { images } from "@/lib/images";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import ArchiveBrowser from "@/components/archive/ArchiveBrowser";
import { entries } from "@/data/entries";
export default function HomePage() {
  const { language } = useLanguage();
  return (
    <>
      <Hero />

      {/* Why This Knowledge Matters */}
      <section
        id="why-it-matters"
        className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <FadeIn className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
              <Image
                src={images.aboutCommunity}
                alt="Community members working together on a traditional roof"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="lg:col-span-7">
            <SectionHeading
              eyebrow="Why This Knowledge Matters"
              title="Practical knowledge, passed hand to hand between generations"
            />
            <div className="mt-6 space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl">
              <p>
                {localizeLabel(
                  "For generations, families have covered their homes using nothing more than palm leaves, patience, and knowledge passed down without ever being written on paper. A skilled elder can look at a single frond and know exactly how it should be cut, dried, and woven — knowledge built entirely through years of practice and memory.",
                  language,
                )}
              </p>
              <p>
                {localizeLabel(
                  "As building materials change and fewer young people learn the craft, this knowledge is at risk of disappearing within a single generation. Documenting these techniques now, directly from the people who hold them, helps preserve not just a building method, but a piece of cultural memory.",
                  language,
                )}
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm-deep"
            >
              {localizeLabel("Read more about this archive", language)}{" "}
              <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>
      </section>

      <WeaveDivider />

      <section className="bg-cream-deep">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.1] font-medium text-ink">
              {localizeLabel("Explore Palm-Leaf Houses", language)}
            </h2>
            <p className="max-w-2xl text-base sm:text-lg text-ink-soft leading-relaxed">
              {localizeLabel(
                "Discover traditional Khmer knowledge of palm-leaf houses, from preparing and weaving palm leaves to covering, constructing, and maintaining traditional homes.",
                language,
              )}
            </p>
          </FadeIn>
          <div className="mt-8">
            <Suspense fallback={null}>
              <ArchiveBrowser items={entries} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="weave-bg-dark text-ink">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16 text-center">
          <FadeIn>
            <Leaf className="mx-auto mb-5" size={28} />
            <h2 className="font-display text-3xl sm:text-4xl font-medium">
              {localizeLabel("Help Preserve Traditional Knowledge", language)}
            </h2>
            <p className="mt-4 text-ink-soft text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              {localizeLabel(
                "Every story, technique, and memory can help keep this knowledge alive.",
                language,
              )}
            </p>
            <Link
              href="/#archive"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-8 py-4 text-sm font-semibold tracking-wide hover:bg-beige-soft transition-colors duration-200"
            >
              {localizeLabel("Explore the Archive", language)}
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
