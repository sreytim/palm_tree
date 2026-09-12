"use client";
import { useLanguage } from "./LanguageProvider";
export default function CategoryFilter({ categories, active, onChange, }) {
    const { t } = useLanguage();
    const all = ["All", ...categories];
    return (<div className="flex flex-wrap gap-2" role="group" aria-label={t("filterByCategory")}>
      {all.map((cat) => {
            const isActive = active === cat;
            return (<button key={cat} type="button" onClick={() => onChange(cat)} aria-pressed={isActive} className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors duration-200 ${isActive
                    ? "bg-palm border-palm text-cream"
                    : "bg-transparent border-beige text-ink-soft hover:border-palm hover:text-palm-deep"}`}>
            {cat === "All" ? t("all") : cat}
          </button>);
        })}
    </div>);
}
