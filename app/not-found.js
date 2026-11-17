"use client";

import Link from "next/link";
import { useLanguage } from "@/components/common/LanguageProvider";

/**
 * Shown by `notFound()` — a missing entry, a withdrawn submission, or a URL
 * that no longer exists. It says what happened in plain words and offers a way
 * back, instead of the framework's bare default page.
 */
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-deep">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
        {t("notFoundHint")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-palm px-6 py-3 font-semibold text-cream transition-colors hover:bg-palm-deep"
      >
        {t("backHome")}
      </Link>
    </section>
  );
}
