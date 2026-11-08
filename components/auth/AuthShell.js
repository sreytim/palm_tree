"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/common/LanguageProvider";

// Field, button and message styling shared by the sign-in, sign-up and the two
// password-recovery pages, so all of them read as one small, calm form.
export const authLabelClass = "block text-sm font-medium text-ink";
export const authFieldClass =
  "mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-palm focus:ring-2 focus:ring-palm/20";
export const authPrimaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-palm px-6 py-3 text-base font-semibold text-cream transition-colors hover:bg-palm-deep disabled:cursor-not-allowed disabled:opacity-60";
export const authErrorClass =
  "rounded-xl bg-clay/10 p-3 text-sm leading-relaxed text-clay-deep";
export const authNoticeClass =
  "rounded-xl bg-palm/10 p-3 text-sm leading-relaxed text-palm-deep";
export const authTextLinkClass =
  "font-semibold text-palm-deep transition-colors hover:text-palm hover:underline";

/**
 * A labelled input. Password fields get an eye button so the visitor can check
 * what they typed before saving it: the masked field shows the slashed eye, and
 * clicking swaps it for the open eye and reveals the text. The button is a real
 * <button type="button">, so it never submits the form, and its label follows
 * the language switcher.
 */
export function AuthField({ id, label, type = "text", hint, ...inputProps }) {
  const { t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);
  const isPassword = type === "password";
  const revealLabel = isRevealed ? t("hidePassword") : t("showPassword");

  return (
    <div>
      <label htmlFor={id} className={authLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && isRevealed ? "text" : type}
          className={isPassword ? `${authFieldClass} pr-12` : authFieldClass}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsRevealed((revealed) => !revealed)}
            aria-label={revealLabel}
            aria-pressed={isRevealed}
            title={revealLabel}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-ink-soft transition-colors hover:text-ink"
          >
            {isRevealed ? (
              <Eye size={20} aria-hidden="true" />
            ) : (
              <EyeOff size={20} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-soft">{hint}</p> : null}
    </div>
  );
}

/**
 * Frame for the account pages: one centred card with the archive's eyebrow,
 * display heading and spacing. It replaces the old inline-styled, fixed 100vh
 * blocks, so these pages now share the site's responsive rhythm — the header
 * and footer stay visible and a short screen no longer adds a fake scrollbar.
 */
export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  const { t } = useLanguage();

  return (
    <section className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-beige bg-cream p-6 shadow-[0_18px_45px_rgba(74,46,23,0.12)] sm:p-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-clay-deep">
            {eyebrow ?? t("myAccount")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {description}
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? (
          <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
        ) : null}
      </div>
    </section>
  );
}
