"use client";

import { useLanguage } from "@/components/common/LanguageProvider";

// Title + hint pair for each reason a management screen is unavailable. Keeping
// the pairs together makes adding a new reason a one-line change.
const MESSAGES = {
  editorAccessRequired: ["editorAccessRequired", "editorAccessRequiredHint"],
  adminAccessRequired: ["adminAccessRequired", "adminAccessRequiredHint"],
  reviewPermissionUnavailable: [
    "reviewUnavailable",
    "reviewPermissionUnavailableHint",
  ],
  reviewEntriesUnavailable: ["reviewUnavailable", "reviewEntriesUnavailableHint"],
  reviewUnavailable: ["reviewUnavailable", "reviewUnavailableHint"],
};

export default function ReviewStatusMessage({ message }) {
  const { t } = useLanguage();
  const [titleKey, hintKey] = MESSAGES[message] ?? MESSAGES.reviewUnavailable;

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="font-display text-3xl font-medium text-ink">
        {t(titleKey)}
      </h1>
      <p className="mt-4 text-ink-soft">{t(hintKey)}</p>
    </section>
  );
}
