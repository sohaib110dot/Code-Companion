import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Headphones, DownloadCloud, Zap, ShieldCheck, Sun, Moon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n-context";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (!showLanguageDropdown) return;
    
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[aria-label="Change language"]') && !target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLanguageDropdown]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setShowLanguageDropdown(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const breadcrumbMap: Record<string, Array<{name: string; url: string}>> = {
      "/": [{ name: "Home", url: "https://fastaudio.cc/" }],
      "/about": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "About", url: "https://fastaudio.cc/about" }],
      "/contact": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Contact", url: "https://fastaudio.cc/contact" }],
      "/terms": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Terms", url: "https://fastaudio.cc/terms" }],
      "/privacy-policy": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Privacy", url: "https://fastaudio.cc/privacy-policy" }],
      "/disclaimer": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Disclaimer", url: "https://fastaudio.cc/disclaimer" }],
      "/dmca": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "DMCA Policy", url: "https://fastaudio.cc/dmca" }],
      "/faqs": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "FAQs", url: "https://fastaudio.cc/faqs" }],
      "/convert-video-to-mp3": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Convert Video to MP3", url: "https://fastaudio.cc/convert-video-to-mp3" }],
      "/extract-audio": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Extract Audio", url: "https://fastaudio.cc/extract-audio" }],
      "/mobile-convert": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Convert on Mobile", url: "https://fastaudio.cc/mobile-convert" }],
      "/mp3-vs-wav": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "MP3 vs WAV", url: "https://fastaudio.cc/mp3-vs-wav" }],
      "/convert-without-software": [{ name: "Home", url: "https://fastaudio.cc/" }, { name: "Convert Without Software", url: "https://fastaudio.cc/convert-without-software" }],
    };
    const breadcrumbs = breadcrumbMap[location] || [{ name: "Home", url: "https://fastaudio.cc/" }];
    let breadcrumbScript = document.querySelector('script[data-type="breadcrumb-schema"]') as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.type = "application/ld+json";
      breadcrumbScript.setAttribute("data-type", "breadcrumb-schema");
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": item.name,
        "item": item.url
      }))
    });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl" role="banner">
        <div className="container mx-auto px-4 h-20 flex items-center justify-center relative">
          <Link href="/" className="absolute left-14 flex items-center gap-3 group mt-[0px] pl-[22px] pr-[22px] border-t-[0px] border-r-[0px] border-b-[0px] border-l-[0px] rounded-tl-[0px] rounded-tr-[0px] rounded-br-[0px] rounded-bl-[0px] text-[45px] mb-[0px] pt-[5px] pb-[5px] bg-[transparent] font-bold ml-[230px] mr-[230px]" aria-label="FastAudio - Convert Videos to MP3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Fast<span className="text-primary">Audio</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6" role="navigation" aria-label="Primary navigation">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/" ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={location === "/" ? "page" : undefined}
            >
              {t("home")}
            </Link>
            <Link
              href="/faqs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/faqs" ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={location === "/faqs" ? "page" : undefined}
            >
              {t("faqs")}
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label={t("toggleTheme")}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="p-2 px-3 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium pl-[10px] pr-[10px] pt-[10px] pb-[10px]"
                aria-label={t("changeLanguage")}
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto language-dropdown">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors hover:bg-primary/10",
                        language === lang.code ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <div className="ad-slot-placeholder w-full h-[90px] md:h-[120px] max-w-4xl mx-auto" />
      </div>
      <main className="flex-1 container mx-auto px-4 pb-12">
        {children}
      </main>
      <div className="container mx-auto px-4 py-8">
        <div className="ad-slot-placeholder w-full h-[90px] max-w-4xl mx-auto" />
      </div>
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Headphones className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">FastAudio</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                {t("tagline")}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-accent" /> {t("lightningFast")}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> {t("secure")}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">{t("legal")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("disclaimer")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("dmcaPolicy")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">{t("resources")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("videoToMp3Converter")}
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("faqs")}
                  </Link>
                </li>
                <li>
                  <Link href="/convert-video-to-mp3" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("convertVideoToMp3")}
                  </Link>
                </li>
                <li>
                  <Link href="/extract-audio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("extractAudio")}
                  </Link>
                </li>
                <li>
                  <Link href="/mp3-vs-wav" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("mp3VsWavGuide")}
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-convert" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("convertOnMobile")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-xl text-center md:text-right">
              {t("disclaimer_text")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
