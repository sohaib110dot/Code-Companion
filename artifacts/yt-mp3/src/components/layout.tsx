import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Headphones, Zap, ShieldCheck, Sun, Moon, ChevronDown, Menu, X } from "lucide-react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowMobileMenu(false);
  }, [location]);

  useEffect(() => {
    if (!showLanguageDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLanguageDropdown]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setShowLanguageDropdown(false);
    setShowMobileMenu(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0" aria-label="FastAudio - Convert Videos to MP3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              <Headphones className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight">
              Fast<span className="text-primary">Audio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-4" role="navigation" aria-label="Primary navigation">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                location === "/" ? "text-primary bg-primary/5" : "text-muted-foreground"
              )}
              aria-current={location === "/" ? "page" : undefined}
            >
              {t("home")}
            </Link>
            <Link
              href="/faqs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                location === "/faqs" ? "text-primary bg-primary/5" : "text-muted-foreground"
              )}
              aria-current={location === "/faqs" ? "page" : undefined}
            >
              {t("faqs")}
            </Link>

            {/* Theme Toggle */}
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary text-sm font-medium language-dropdown"
                aria-label={t("changeLanguage")}
              >
                <span>{currentLang.flag}</span>
                <span className="hidden md:inline">{currentLang.name}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showLanguageDropdown && "rotate-180")} />
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto language-dropdown">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors hover:bg-primary/10 first:rounded-t-xl last:rounded-b-xl",
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

          {/* Mobile: Theme + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label={t("toggleTheme")}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : <div className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              {t("home")}
            </Link>
            <Link
              href="/faqs"
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location === "/faqs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              {t("faqs")}
            </Link>
            <div className="pt-2 border-t border-border/40">
              <p className="px-3 py-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">Language</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      language === lang.code ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Headphones className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">FastAudio</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6 text-sm leading-relaxed">
                {t("tagline")}
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-accent" /> {t("lightningFast")}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> {t("secure")}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground text-sm uppercase tracking-wider">{t("legal")}</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/terms", label: t("termsOfService") },
                  { href: "/privacy-policy", label: t("privacyPolicy") },
                  { href: "/disclaimer", label: t("disclaimer") },
                  { href: "/contact", label: t("contact") },
                  { href: "/about", label: t("about") },
                  { href: "/dmca", label: t("dmcaPolicy") },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground text-sm uppercase tracking-wider">{t("resources")}</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: t("videoToMp3Converter") },
                  { href: "/faqs", label: t("faqs") },
                  { href: "/convert-video-to-mp3", label: t("convertVideoToMp3") },
                  { href: "/extract-audio", label: t("extractAudio") },
                  { href: "/mp3-vs-wav", label: t("mp3VsWavGuide") },
                  { href: "/mobile-convert", label: t("convertOnMobile") },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
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
