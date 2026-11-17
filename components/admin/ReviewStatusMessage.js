"use client";

import { useLanguage } from "@/components/common/LanguageProvider";
import { roleLabelKey } from "@/lib/submission-status";

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

/**
 * Explains why an admin screen is closed.
 *
 * `signedInAs` / `role` are optional: when a screen refuses access they show
 * which account was recognised and with what role, so a mis-provisioned owner
 * sees "Signed in as … — role: contributor" instead of a bare "access
 * required" with nothing to act on.
 */
export default function ReviewStatusMessage({
  message,
  signedInAs = null,
  role = null,
}) {
  const { t } = useLanguage();
  const [titleKey, hintKey] = MESSAGES[message] ?? MESSAGES.reviewUnavailable;

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="font-display text-3xl font-medium text-ink">
        {t(titleKey)}
      </h1>
      <p className="mt-4 text-ink-soft">{t(hintKey)}</p>
      {signedInAs && (
        <p className="mt-3 text-sm text-ink-soft">
          {t("signedInAs")}:{" "}
          <span className="font-medium text-ink">{signedInAs}</span>
          {" · "}
          {t("accountRole")}:{" "}
          <span className="font-medium text-ink">{t(roleLabelKey(role))}</span>
        </p>
      )}
    </section>
  );
}
