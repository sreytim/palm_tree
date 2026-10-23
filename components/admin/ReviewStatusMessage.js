"use client";

import { useLanguage } from "@/components/common/LanguageProvider";

export default function ReviewStatusMessage({ message }) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="font-display text-3xl font-medium text-ink">
        {t(message === "editorAccessRequired" ? message : "reviewUnavailable")}
      </h1>
      <p className="mt-4 text-ink-soft">
        {t(
          message === "editorAccessRequired"
            ? "editorAccessRequiredHint"
            : message === "reviewPermissionUnavailable"
              ? "reviewPermissionUnavailableHint"
              : message === "reviewEntriesUnavailable"
                ? "reviewEntriesUnavailableHint"
                : "reviewUnavailableHint",
        )}
      </p>
    </section>
  );
}
