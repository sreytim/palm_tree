"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Lightbulb, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/components/common/LanguageProvider";
import ArchiveCard from "@/components/archive/ArchiveCard";
import { localizeLabel } from "@/lang/i18n";
import { supabase } from "@/lib/supabase-client";
import { COLUMNS, toUiEntry } from "@/lib/entry-mapping";
import { withBilingualContent } from "@/lib/entry-content";

export default function ArchiveEntryPage({ params }) {
  const { slug } = use(params);
  const [lookup, setLookup] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    let active = true;

    supabase
      .from("entries")
      .select(COLUMNS)
      .eq("slug", slug)
      .then(async ({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Could not load archive entry:", error);
          setLookup({ slug, item: null, related: [], failed: true });
          return;
        }

        const row = Array.isArray(data) ? data[0] : data;

        if (!row) {
          setLookup({ slug, item: null, related: [], failed: false });
          return;
        }

        const item = withBilingualContent(toUiEntry(row));

        // Three more entries to read next: first the same section of the
        // archive, then — when that section is small — anything that shares a
        // topic with this entry.
        let { data: siblings, error: siblingError } = await supabase
          .from("entries")
          .select(COLUMNS)
          .eq("status", "published")
          .eq("category", item.category)
          .neq("id", item.id)
          .limit(3);

        if (
          !siblingError &&
          (siblings ?? []).length === 0 &&
          item.topicSlugs.length > 0
        ) {
          const byTopic = await supabase
            .from("entries")
            .select(COLUMNS)
            .eq("status", "published")
            .overlaps("topic_slugs", item.topicSlugs)
            .neq("id", item.id)
            .limit(3);

          siblings = byTopic.data;
          siblingError = byTopic.error;
        }

        if (!active) return;

        if (siblingError) {
          console.error("Could not load related archive entries:", siblingError);
        }

        setLookup({
          slug,
          item,
          related: (siblings ?? []).map(toUiEntry).map(withBilingualContent),
          failed: false,
        });
      })
      .catch((error) => {
        if (!active) return;
        console.error("Could not load archive entry:", error);
        setLookup({ slug, item: null, related: [], failed: true });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const currentLookup = lookup?.slug === slug ? lookup : null;
  const item = currentLookup?.item ?? null;
  const related = currentLookup?.related ?? [];
  const isLoading = !currentLookup;
  const loadFailed = Boolean(currentLookup?.failed);
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

  const isPending = item.status === "pending";
  const isReturned = item.status === "returned";
  // The eight curated entries travel with both languages (see
  // data/entry-content.js). A community submission that has not been translated
  // yet says so, rather than quietly switching to English mid-page.
  const hasKhmerCopy =
    typeof item.title === "object"
      ? Boolean(item.title?.km)
      : /[\u1780-\u17FF]/.test(item.title ?? "");

  return (
    <article>
      {language === "km" && !hasKhmerCopy && (
        <p className="bg-clay/15 px-5 py-3 text-center text-sm text-clay-deep">
          {t("untranslatedEntryNotice")}
        </p>
      )}
      {isPending && (
        <p className="bg-beige-soft px-5 py-3 text-center text-sm text-ink">
          {t("pendingReviewNotice")}
        </p>
      )}
      {isReturned && (
        <p className="bg-clay/15 px-5 py-3 text-center text-sm text-clay-deep">
          {t("returnedPreviewNotice")}
        </p>
      )}
      <div className="relative h-[46vh] min-h-[320px] w-full sm:h-[56vh]">
        <Image
          src={item.image}
          alt={localizeLabel(item.imageAlt, language)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/85 via-wood-deep/25 to-wood-deep/10" />
        {/* On top of the photo, where the eye lands first, so the way back is
            obvious without scrolling to the end of a long entry. */}
        <Link
          href="/archive"
          className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2.5 text-sm font-semibold text-wood-deep shadow-lg shadow-wood-deep/30 ring-1 ring-wood-deep/10 transition-colors hover:bg-cream sm:left-8 sm:top-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t("backToArchive")}
        </Link>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8">
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
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-beige pb-6 text-sm text-ink-soft">
          {item.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-palm-deep" aria-hidden="true" />
              <span>
                {t("location")}: {localizeLabel(item.location, language)}
              </span>
            </span>
          )}
          {item.contributor && (
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-palm-deep" aria-hidden="true" />
              <span>
                {t("contributor")}: {item.contributor}
              </span>
            </span>
          )}
          {item.date && (
            <span className="flex items-center gap-1.5">
              <CalendarDays
                size={15}
                className="text-palm-deep"
                aria-hidden="true"
              />
              <span>
                {t("date")}: {item.date}
              </span>
            </span>
          )}
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
              <li key={`step-${index}`} className="flex gap-5">
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
            <ul className="space-y-4">
              {item.tips.map((tip, index) => (
                <li
                  key={`tip-${index}`}
                  className="flex gap-3 rounded-2xl border border-beige bg-cream-deep p-4 text-sm leading-relaxed text-ink-soft sm:text-base"
                >
                  <Lightbulb
                    size={18}
                    className="mt-0.5 shrink-0 text-clay-deep"
                    aria-hidden="true"
                  />
                  <span>{localizeLabel(tip, language)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-beige bg-cream-deep/60">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
            <h2 className="mb-6 font-display text-2xl font-medium text-ink">
              {t("relatedEntries")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((sibling) => (
                <ArchiveCard key={sibling.id} item={sibling} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:pb-20">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 rounded-full border-2 border-wood px-6 py-3 text-sm font-semibold text-wood transition-colors duration-200 hover:bg-wood hover:text-cream"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t("backToArchive")}
        </Link>
      </div>
    </article>
  );
}
