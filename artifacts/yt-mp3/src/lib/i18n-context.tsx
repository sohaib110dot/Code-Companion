import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, LanguageCode, TranslationKey } from "./translations";

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem("app-language") || "en") as LanguageCode;
    setLanguageState(savedLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
    let text = translations[language][key] || translations.en[key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
