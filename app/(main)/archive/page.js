import { Suspense } from "react";
import ArchiveBrowser from "@/components/archive/ArchiveBrowser";
import { entries } from "@/data/entries";

export const metadata = {
  title: "Archive | Traditional Palm-Leaf House Covering Techniques",
  description:
    "Browse the community archive of palm-leaf house coverage techniques and stories.",
};

export default function ArchivePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-deep">
          Community archive
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          Archive
        </h1>
      </div>

      <Suspense fallback={null}>
        <ArchiveBrowser items={entries} />
      </Suspense>
    </main>
  );
}
