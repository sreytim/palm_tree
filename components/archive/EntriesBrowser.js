"use client";

import { useEffect, useState } from "react";
import ArchiveBrowser from "./ArchiveBrowser";
import { useLanguage } from "../common/LanguageProvider";
import { fetchEntries } from "@/lib/entries";

/**
 * Loads entries from Supabase and hands them to ArchiveBrowser, which keeps its
 * existing search, category filter and zero-result behaviour.
 *
 * Three states are handled here so a slow or failing request never looks like
 * an empty archive: loading, error, and genuinely no rows.
 */
function LoadingGrid({ label }) {
  return (
    <div>
      <p className="sr-only" role="status" aria-live="polite">
        {label}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-beige bg-cream"
          >
            <div className="aspect-[4/3] rounded-t-3xl bg-beige-soft" />
            <div className="space-y-3 p-6">
              <div className="h-4 w-3/4 rounded bg-beige-soft" />
              <div className="h-3 w-full rounded bg-beige-soft" />
              <div className="h-3 w-2/3 rounded bg-beige-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EntriesBrowser({ pageSize }) {
  const { t } = useLanguage();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchEntries()
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div
        role="alert"
        className="mt-8 rounded-3xl border border-dashed border-beige px-6 py-12 text-center"
      >
        <p className="font-display text-xl font-medium text-ink">
          {t("loadErrorTitle")}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {t("loadErrorHint")}
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-xs text-ink-soft/70">
          {error}
        </p>
      </div>
    );
  }

  if (items === null) {
    return <LoadingGrid label={t("loadingEntries")} />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-beige px-6 py-12 text-center">
        <p className="font-display text-xl font-medium text-ink">
          {t("emptyArchiveTitle")}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {t("emptyArchiveHint")}
        </p>
      </div>
    );
  }

  return <ArchiveBrowser items={items} pageSize={pageSize} />;
}