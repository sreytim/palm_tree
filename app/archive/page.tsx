import { Suspense } from "react";
import type { Metadata } from "next";
import ArchiveBrowser from "@/components/ArchiveBrowser";
import ArchiveCard from "@/components/ArchiveCard";
import SectionHeading from "@/components/SectionHeading";
import { archiveItems, getFeaturedArchiveItems } from "@/data/archive";

export const metadata: Metadata = {
  title: "Archive | Traditional Palm-Leaf House Covering Techniques",
  description: "Browse documented techniques, entries, and contributions from the community archive.",
};

export default function ArchivePage() {
  const featured = getFeaturedArchiveItems();

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <SectionHeading
        eyebrow="The Archive"
        title="Browse the collection"
        lede="Search and filter documented techniques, stories, and structures — each entry built from real conversations with people who carry this knowledge."
      />

      {featured.length > 0 && (
        <section className="mt-14" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-5">
            Featured Entries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <ArchiveCard key={item.id} item={item} view="grid" />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-5">
          All Entries
        </h2>
        <Suspense fallback={<div className="text-sm text-ink-soft">Loading archive…</div>}>
          <ArchiveBrowser items={archiveItems} />
        </Suspense>
      </section>
    </div>
  );
}
