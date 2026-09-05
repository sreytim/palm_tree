import { Suspense } from "react";
import type { Metadata } from "next";
import ArchiveBrowser from "@/components/ArchiveBrowser";
import SectionHeading from "@/components/SectionHeading";
import { entries } from "@/data/entries";

export const metadata: Metadata = {
  title: "Archive | Traditional Palm-Leaf House Covering Techniques",
  description:
    "Browse documented techniques, entries, and contributions from the community archive.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <SectionHeading
        eyebrow="The Archive"
        title="Browse the collection"
        lede="Search and filter documented techniques, stories, and structures — each entry built from real conversations with people who carry this knowledge."
      />

      <section className="mt-14">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-5">
          All Entries
        </h2>
        <Suspense
          fallback={
            <div className="text-sm text-ink-soft">Loading archive…</div>
          }
        >
          <ArchiveBrowser items={entries} />
        </Suspense>
      </section>
    </div>
  );
}
