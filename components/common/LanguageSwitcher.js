"use client";
import { useLanguage } from "./LanguageProvider";
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("chooseLanguage")}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("km")}
        aria-pressed={language === "km"}
      >
        ខ្មែរ
      </button>
    </div>
  );
}
