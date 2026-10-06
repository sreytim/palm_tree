"use client";

import { Suspense } from "react";
import EntriesBrowser from "@/components/archive/EntriesBrowser";
import { useLanguage } from "@/components/common/LanguageProvider";

export default function ArchivePage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-deep">
          {t("communityArchiveLabel")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          {t("generalArchivePageTitle")}
        </h1>
      </div>

      <Suspense fallback={null}>
        <EntriesBrowser />
      </Suspense>
    </main>
  );
}
