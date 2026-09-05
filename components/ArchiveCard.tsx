"use client";

import Link from "next/link";
import Image from "next/image";
import { ArchiveItem } from "@/lib/types";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { localizeLabel } from "@/lib/i18n";

export default function ArchiveCard({
  item,
  view = "grid",
}: {
  item: ArchiveItem;
  view?: "grid" | "list";
}) {
  const { language, t } = useLanguage();
  if (view === "list") {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 rounded-3xl bg-cream border border-beige p-4 hover:shadow-[0_16px_36px_-24px_rgba(43,36,23,0.4)] transition-shadow duration-300">
        <div className="relative w-full sm:w-56 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden img-zoom">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="224px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-clay-deep bg-clay/10 px-2.5 py-1 rounded-full">
              {localizeLabel(item.category, language)}
            </span>
            {item.isSample && (
              <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-ink-soft/70">
                {t("sampleEntry")}
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-medium text-ink">
            {localizeLabel(item.title, language)}
          </h3>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2">
            {localizeLabel(item.description, language)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft/80">
            <span>{item.contributor}</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {item.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {item.location}
            </span>
          </div>
          <Link
            href={`/archive/${item.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep w-fit"
          >
            {t("viewDetails")}{" "}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-cream border border-beige hover:shadow-[0_20px_40px_-20px_rgba(43,36,23,0.35)] transition-shadow duration-300">
      <div className="relative aspect-[4/3] img-zoom">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-cream bg-palm-deep/90 backdrop-blur px-2.5 py-1 rounded-full">
          {localizeLabel(item.category, language)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-medium text-ink leading-snug">
          {localizeLabel(item.title, language)}
        </h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed flex-1 line-clamp-3">
          {localizeLabel(item.description, language)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft/80">
          <span>{item.contributor}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{item.date}</span>
        </div>
        <Link
          href={`/archive/${item.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep w-fit"
        >
          {t("viewDetails")}{" "}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
