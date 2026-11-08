"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import {
  STATUS_HINT_KEYS,
  STATUS_LABEL_KEYS,
  getSubmissionActions,
} from "@/lib/submission-status";

const STATUS_STYLES = {
  pending: "border-clay/40 bg-beige-soft text-clay-deep",
  published: "border-palm/40 bg-palm text-cream",
  returned: "border-clay bg-clay/10 text-clay-deep",
};

function StatusBadge({ status, t }) {
  const style =
    STATUS_STYLES[status] ?? "border-beige bg-cream-deep text-ink-soft";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] ${style}`}
    >
      {t(STATUS_LABEL_KEYS[status] ?? status)}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString();
}

export default function MySubmissions({
  isAuthenticated,
  authFailed,
  entries,
  loadFailed,
  justSubmitted,
  justUpdated,
}) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [error, setError] = useState("");

  const withdraw = async (entry) => {
    if (!window.confirm(t("withdrawConfirm"))) {
      return;
    }

    setWithdrawingId(entry.id);
    setError("");

    try {
      const response = await fetch(
        `/api/entries/${encodeURIComponent(entry.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        console.error("Could not withdraw the submission:", result);
        setError(result.errorKey ? t(result.errorKey) : t("withdrawFailed"));
        return;
      }

      router.refresh();
    } catch (requestError) {
      console.error("Withdraw request failed:", requestError);
      setError(t("withdrawFailed"));
    } finally {
      setWithdrawingId(null);
    }
  };

  if (authFailed) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          {t("contributionAuthUnavailable")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          {t("contributionAuthUnavailableHint")}
        </p>
        <Link
          href="/my-submissions"
          className="mt-8 inline-flex rounded-full bg-palm px-6 py-3 font-semibold text-cream hover:bg-palm-deep"
        >
          {t("tryAgain")}
        </Link>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          {t("mySubmissionsSignInTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          {t("mySubmissionsSignInHint")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login?next=%2Fmy-submissions"
            className="rounded-full bg-palm px-6 py-3 font-semibold text-cream hover:bg-palm-deep"
          >
            {t("logIn")}
          </Link>
          <Link
            href="/signup?next=%2Fmy-submissions"
            className="rounded-full border border-palm px-6 py-3 font-semibold text-palm-deep hover:bg-beige-soft"
          >
            {t("createAccount")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay-deep">
          {t("contributorRole")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          {t("mySubmissions")}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t("mySubmissionsHint")}
        </p>
        <Link
          href="/contribute"
          className="mt-6 inline-flex rounded-full bg-palm px-6 py-3 font-semibold text-cream hover:bg-palm-deep"
        >
          {t("contributeEntry")}
        </Link>
      </div>

      {justSubmitted && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-palm/10 p-4 text-sm text-palm-deep"
        >
          {t("submissionReceived")}
        </p>
      )}
      {justUpdated && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-palm/10 p-4 text-sm text-palm-deep"
        >
          {t("submissionUpdated")}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep"
        >
          {error}
        </p>
      )}
      {loadFailed && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep"
        >
          {t("mySubmissionsLoadFailed")}
        </p>
      )}

      {entries.length === 0 && !loadFailed ? (
        <div className="rounded-3xl border border-beige bg-cream-deep p-6">
          <h2 className="font-display text-xl font-medium text-ink">
            {t("mySubmissionsEmpty")}
          </h2>
          <p className="mt-2 text-ink-soft">{t("mySubmissionsEmptyHint")}</p>
        </div>
      ) : (
        <ul className="space-y-5">
          {entries.map((entry) => {
            const actions = getSubmissionActions(entry.status);
            const isWithdrawing = withdrawingId === entry.id;

            return (
              <li
                key={entry.id}
                className="rounded-3xl border border-beige bg-cream p-5 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay-deep">
                      {localizeLabel(entry.category, language)}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-medium text-ink">
                      {localizeLabel(entry.title, language)}
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      {t("submittedOn")}: {formatDate(entry.createdAt)}
                      {entry.date ? ` · ${entry.date}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={entry.status} t={t} />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {t(STATUS_HINT_KEYS[entry.status] ?? "statusPendingHint")}
                </p>

                {entry.reviewNote && (
                  <div className="mt-4 rounded-2xl bg-clay/10 p-4 text-sm text-clay-deep">
                    <strong className="text-ink">{t("reviewNoteLabel")}</strong>{" "}
                    {entry.reviewNote}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/archive/${encodeURIComponent(entry.slug)}`}
                    className="rounded-full border border-palm px-5 py-2.5 text-sm font-semibold text-palm-deep hover:bg-beige-soft"
                  >
                    {actions.isPublic
                      ? t("viewPublishedEntry")
                      : t("previewSubmission")}
                  </Link>

                  {actions.canEdit && (
                    <Link
                      href={`/my-submissions/${encodeURIComponent(entry.id)}/edit`}
                      className="rounded-full bg-palm px-5 py-2.5 text-sm font-semibold text-cream hover:bg-palm-deep"
                    >
                      {entry.status === "returned"
                        ? t("reviseAndResubmit")
                        : t("editSubmission")}
                    </Link>
                  )}

                  {actions.canWithdraw && (
                    <button
                      type="button"
                      onClick={() => withdraw(entry)}
                      disabled={withdrawingId !== null}
                      className="rounded-full border border-clay px-5 py-2.5 text-sm font-semibold text-clay-deep hover:bg-clay/10 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isWithdrawing
                        ? t("withdrawingSubmission")
                        : t("withdrawSubmission")}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

