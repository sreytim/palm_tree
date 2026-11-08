"use client";

import Link from "next/link";
import { useLanguage } from "@/components/common/LanguageProvider";
import ContributionForm from "./ContributionForm";

/**
 * Edit form for an existing entry.
 *
 * Used by the contributor (`/my-submissions/[id]/edit`) and by the archive team
 * (`/admin/entries/[id]/edit`). The heading copy is injected so both can share
 * one form without sharing one route.
 */
export default function SubmissionEditor({
  entryId,
  initialEntry,
  status,
  reviewNote,
  headingKey = "editSubmission",
  hintKey = "editSubmissionHint",
  backHref = "/my-submissions",
  backLabelKey = "mySubmissions",
  redirectTo = "/my-submissions",
}) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <Link
          href={backHref}
          className="font-mono text-xs uppercase tracking-[0.18em] text-clay-deep hover:text-palm-deep"
        >
          ← {t(backLabelKey)}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          {t(headingKey)}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t(hintKey)}
        </p>
      </div>

      {status === "returned" && (
        <div className="mb-8 rounded-2xl bg-clay/10 p-5 text-sm text-clay-deep">
          <p className="font-semibold text-ink">{t("returnedNoticeTitle")}</p>
          <p className="mt-1 leading-relaxed">
            {reviewNote || t("returnedNoticeNoNote")}
          </p>
          <p className="mt-2 leading-relaxed">{t("returnedNoticeResubmit")}</p>
        </div>
      )}

      <ContributionForm
        entryId={entryId}
        initialEntry={initialEntry}
        redirectTo={redirectTo}
      />
    </section>
  );
}
