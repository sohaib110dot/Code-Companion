// Auto-translate missing content using Google Translate API
const LANG_CODES: Record<string, string> = {
  en: "en",
  es: "es",
  de: "de",
  ar: "ar",
  pt: "pt",
  ru: "ru",
  id: "id",
  tr: "tr",
  fr: "fr",
  it: "it",
  hi: "hi",
  ja: "ja",
  ko: "ko",
  th: "th",
};

const translationCache: Record<string, Record<string, string>> = {};

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === "en") return text;
  
  // Check cache first
  if (!translationCache[targetLang]) {
    translationCache[targetLang] = {};
  }
  if (translationCache[targetLang][text]) {
    return translationCache[targetLang][text];
  }

  try {
    // Use Google Translate API (free tier)
    const url = `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit`;
    
    // Alternative: Use simple string replacement with known translations
    // Or use a lightweight translator library
    const targetCode = LANG_CODES[targetLang] || targetLang;
    
    // For now, use a free translation endpoint
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const translated = data.responseData?.translatedText || text;
      translationCache[targetLang][text] = translated;
      return translated;
    }
  } catch (error) {
    console.warn(`Translation failed for "${text}" to ${targetLang}:`, error);
  }
  
  return text; // Fallback to English if translation fails
}

export function clearTranslationCache() {
  Object.keys(translationCache).forEach(key => {
    translationCache[key] = {};
  });
}
