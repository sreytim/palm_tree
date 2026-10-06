"use client";

import Link from "next/link";
import { useLanguage } from "@/components/common/LanguageProvider";
import ContributionForm from "./ContributionForm";

export default function ContributionPageContent({
  isAuthenticated,
  hasContributorRole,
  authCheckFailed,
  roleCheckFailed,
}) {
  const { t } = useLanguage();

  if (authCheckFailed || roleCheckFailed) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          {t("contributionAuthUnavailable")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          {t("contributionAuthUnavailableHint")}
        </p>
        <Link
          href="/contribute"
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
          {t("contributeSignInTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          {t("contributeSignInHint")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login?next=%2Fcontribute"
            className="rounded-full bg-palm px-6 py-3 font-semibold text-cream hover:bg-palm-deep"
          >
            {t("logIn")}
          </Link>
          <Link
            href="/signup?next=%2Fcontribute"
            className="rounded-full border border-palm px-6 py-3 font-semibold text-palm-deep hover:bg-beige-soft"
          >
            {t("createAccount")}
          </Link>
        </div>
      </section>
    );
  }

  if (!hasContributorRole) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          {t("contributorRole")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          {t("contributorRoleUnavailable")}
        </p>
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
          {t("contributePageTitle")}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t("contributeReviewNotice")}
        </p>
      </div>
      <ContributionForm />
    </section>
  );
}
