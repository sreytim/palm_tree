"use client";

import Gallery from "@/components/gallery/Gallery";
import { galleryImages } from "@/data/gallery";
import { getTopicBySlug } from "@/data/topics";
import { getPersonById } from "@/data/people";
import { useLanguage } from "@/components/common/LanguageProvider";

/**
 * Gallery images reference a `topicSlug` in the shared vocabulary. Resolve it
 * to the display label here so the client gallery renders the same badge text
 * it always has, from a single source of truth.
 */
const imagesWithTopicName = galleryImages
  .filter((image) => getPersonById(image.personId)?.role !== "sample")
  .map((image) => ({
    ...image,
    category: getTopicBySlug(image.topicSlug)?.name ?? image.topicSlug,
  }));

export default function GalleryPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-deep">
          {t("photoArchiveLabel")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          {t("gallery")}
        </h1>
      </div>
      {imagesWithTopicName.length > 0 ? (
        <Gallery images={imagesWithTopicName} />
      ) : (
        <p className="rounded-2xl border border-dashed border-beige px-6 py-12 text-center text-ink-soft">
          {t("noGalleryImages")}
        </p>
      )}
    </main>
  );
}
