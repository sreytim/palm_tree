"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArchiveItemBySlug } from "@/data/entries";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { supabase } from "@/lib/supabase-client";
import { COLUMNS, toUiEntry } from "@/lib/entry-mapping";

export default function ArchiveEntryPage({ params }) {
  const { slug } = params;
  const staticItem = getArchiveItemBySlug(slug);
  const [lookup, setLookup] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (staticItem) return;
    let active = true;

    supabase
      .from("entries")
      .select(COLUMNS)
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Could not load contributed archive entry:", error);
          setLookup({ slug, item: null, failed: true });
        } else {
          setLookup({
            slug,
            item: data ? toUiEntry(data) : null,
            failed: false,
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        console.error("Could not load contributed archive entry:", error);
        setLookup({ slug, item: null, failed: true });
      });

    return () => {
      active = false;
    };
  }, [slug, staticItem]);

  const currentLookup = lookup?.slug === slug ? lookup : null;
  const databaseItem = currentLookup?.item ?? null;
  const isLoading = !staticItem && !currentLookup;
  const loadFailed = Boolean(currentLookup?.failed);
  const item = staticItem || databaseItem;
  if (!item) {
    if (isLoading) {
      return (
        <p role="status" className="mx-auto max-w-5xl px-5 py-16 text-ink-soft">
          {t("loadingEntry")}
        </p>
      );
    }
    if (loadFailed) {
      return (
        <p role="alert" className="mx-auto max-w-5xl px-5 py-16 text-clay-deep">
          {t("entryLoadFailed")}
        </p>
      );
    }
    notFound();
  }

  const isDraft = item.status === "draft";

  return (
    <article>
      {isDraft && (
        <p className="bg-beige-soft px-5 py-3 text-center text-sm text-ink">
          {t("draftReviewNotice")}
        </p>
      )}
      <div className="relative h-[46vh] min-h-[320px] w-full sm:h-[56vh]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/85 via-wood-deep/25 to-wood-deep/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8">
            <Link
              href="/archive"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cream/90 hover:text-cream"
            >
              ← {t("backToArchive")}
            </Link>
            <span className="rounded-full bg-palm-deep/90 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-cream">
              {localizeLabel(item.category, language)}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-medium text-cream sm:text-5xl">
              {localizeLabel(item.title, language)}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 gap-4 border-b border-beige pb-10 text-sm sm:grid-cols-3">
          <div className="text-ink-soft">
            {t("contributor")}: {item.contributor}
          </div>
          <div className="text-ink-soft">
            {t("date")}: {item.date}
          </div>
          <div className="text-ink-soft">
            {t("location")}: {item.location}
          </div>
        </div>

        <section className="pt-10">
          <h2 className="mb-4 font-display text-2xl font-medium text-ink">
            {t("introduction")}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {localizeLabel(item.introduction, language)}
          </p>
        </section>

        <section className="pt-10 sm:pt-12">
          <h2 className="mb-6 font-display text-2xl font-medium text-ink">
            {t("stepByStepProcess")}
          </h2>
          <ol className="space-y-6">
            {item.steps.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-palm font-mono text-sm text-cream">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {localizeLabel(step.title, language)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {localizeLabel(step.description, language)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {item.tips.length > 0 && (
          <section className="pt-10 sm:pt-12">
            <h2 className="mb-6 font-display text-2xl font-medium text-ink">
              {t("traditionalKnowledgeTips")}
            </h2>
            <ul className="space-y-3">
              {item.tips.map((tip) => (
                <li
                  key={tip}
                  className="rounded-2xl border border-beige bg-cream-deep p-4 text-sm leading-relaxed text-ink-soft sm:text-base"
                >
                  {localizeLabel(tip, language)}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="pt-10 sm:pt-12">
          <h2 className="mb-4 font-display text-2xl font-medium text-ink">
            {t("contributorStory")}
          </h2>
          <blockquote className="border-l-4 border-clay pl-5 text-base italic leading-relaxed text-ink sm:text-lg">
            {localizeLabel(item.contributorStory, language)}
          </blockquote>
        </section>
      </div>
    </article>
  );
}
