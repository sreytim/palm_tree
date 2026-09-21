"use client";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "@/lang/i18n";

const LanguageContext = createContext(null);

const isValidLanguage = (value) => value === "en" || value === "km";

export default function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("palm-leaf-language");
      if (isValidLanguage(saved)) {
        startTransition(() => setLanguageState(saved));
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "km" ? "km" : "en";

    try {
      window.localStorage.setItem("palm-leaf-language", language);
    } catch {
      // ignore storage quota errors
    }
  }, [language]);

  const setLanguage = (next) => {
    const normalized = isValidLanguage(next) ? next : "en";
    setLanguageState(normalized);
  };

  const value = useMemo(() => {
    const t = (key) => translations[language]?.[key] ?? key;
    return { language, setLanguage, t };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
