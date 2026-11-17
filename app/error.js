"use client";

import { useLanguage } from "@/components/common/LanguageProvider";

/**
 * Route-level error boundary. It deliberately shows the translated, plain-word
 * message instead of the thrown error or a stack trace.
 */
export default function Error({ reset }) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        {t("errorTitle")}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
        {t("errorHint")}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 inline-flex rounded-full bg-palm px-6 py-3 font-semibold text-cream transition-colors hover:bg-palm-deep"
      >
        {t("tryAgain")}
      </button>
    </section>
  );
}
