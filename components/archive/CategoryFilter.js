"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { ALL_CATEGORIES } from "@/lib/archive-categories";

/**
 * Category dropdown for the archive search, sitting to the right of the search
 * field.
 *
 * A native <select> is deliberate: it is keyboard- and screen-reader-friendly
 * for free, opens the platform picker on phones, and never draws a custom menu
 * over the results. `categories` holds the stored category keys (entry rows keep
 * a raw English key such as "Weaving Techniques") and the labels are localized,
 * so the applied value stays the raw key and switching language never changes
 * what is filtered.
 */
export default function CategoryFilter({
  categories,
  active,
  onChange,
  label,
}) {
  const { language, t } = useLanguage();
  const selectId = useId();

  return (
    <div className="w-full shrink-0 sm:w-auto">
      <label htmlFor={selectId} className="sr-only">
        {label ?? t("filterByCategory")}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={active}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-full border border-beige bg-cream py-3.5 pl-5 pr-11 text-sm font-medium text-ink outline-none transition-colors hover:border-palm focus:border-palm focus:ring-2 focus:ring-palm/20 sm:w-auto sm:min-w-[15rem]"
        >
          <option value={ALL_CATEGORIES}>{t("allCategories")}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {localizeLabel(category, language)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
        />
      </div>
    </div>
  );
}
