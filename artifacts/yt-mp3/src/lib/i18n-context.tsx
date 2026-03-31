import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, LanguageCode, TranslationKey } from "./translations";

const translationCache: Record<string, Record<string, string>> = {};
const LANG_CODES: Record<string, string> = {
  en: "en", es: "es", de: "de", ar: "ar", pt: "pt", ru: "ru",
  id: "id", tr: "tr", fr: "fr", it: "it", hi: "hi", ja: "ja", ko: "ko", th: "th",
};

interface I18nContextType {
  language: LanguageCode;
  lang: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === "en") return text;
  if (!translationCache[targetLang]) translationCache[targetLang] = {};
  if (translationCache[targetLang][text]) return translationCache[targetLang][text];

  try {
    const targetCode = LANG_CODES[targetLang] || targetLang;
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`
    );
    if (response.ok) {
      const data = await response.json();
      const translated = data.responseData?.translatedText || text;
      translationCache[targetLang][text] = translated;
      return translated;
    }
  } catch (e) {
    // Silently fail and return English
  }
  return text;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);
  const [autoTranslations, setAutoTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLang = (localStorage.getItem("app-language") || "en") as LanguageCode;
    setLanguageState(savedLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    // Reset auto translations when language changes
    setAutoTranslations({});
  };

  const t = useCallback((key: TranslationKey, variables?: Record<string, string | number>) => {
    let text = translations[language]?.[key] || translations.en[key] || key;
    
    // For missing translations in non-English languages, use cached translation
    if (language !== "en" && (text === key || !translations[language]?.[key])) {
      const enText = translations.en[key] || key;
      const cacheKey = `${language}:${enText}`;
      if (autoTranslations[cacheKey]) {
        text = autoTranslations[cacheKey];
      } else {
        // Queue translation in background
        (async () => {
          const translated = await translateText(enText, language);
          setAutoTranslations(prev => ({ ...prev, [cacheKey]: translated }));
        })();
        text = enText; // Use English as interim while translating
      }
    }
    
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [language, autoTranslations]);

  return (
    <I18nContext.Provider value={{ language, lang: language, setLanguage, t }}>
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
