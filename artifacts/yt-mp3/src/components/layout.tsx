import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Headphones, DownloadCloud, Zap, ShieldCheck, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    // Add Breadcrumb Schema
    const breadcrumbMap: Record<string, Array<{name: string; url: string}>> = {
      "/": [{ name: "Home", url: "https://fastyt.io/" }],
      "/about": [{ name: "Home", url: "https://fastyt.io/" }, { name: "About", url: "https://fastyt.io/about" }],
      "/contact": [{ name: "Home", url: "https://fastyt.io/" }, { name: "Contact", url: "https://fastyt.io/contact" }],
      "/terms": [{ name: "Home", url: "https://fastyt.io/" }, { name: "Terms", url: "https://fastyt.io/terms" }],
      "/privacy-policy": [{ name: "Home", url: "https://fastyt.io/" }, { name: "Privacy", url: "https://fastyt.io/privacy-policy" }],
      "/convert-video-to-mp3": [{ name: "Home", url: "https://fastyt.io/" }, { name: "Convert Video to MP3", url: "https://fastyt.io/convert-video-to-mp3" }],
      "/extract-audio": [{ name: "Home", url: "https://fastyt.io/" }, { name: "Extract Audio", url: "https://fastyt.io/extract-audio" }],
    };
    const breadcrumbs = breadcrumbMap[location] || [{ name: "Home", url: "https://fastyt.io/" }];
    let breadcrumbScript = document.querySelector('script[data-type="breadcrumb-schema"]');
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
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl" role="banner">
        <div className="container mx-auto px-4 h-20 flex items-center justify-center relative">
          <Link href="/" className="absolute left-4 flex items-center gap-3 group" aria-label="FastYT - Convert Videos to MP3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Fast<span className="text-primary">YT</span>
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
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/about" ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={location === "/about" ? "page" : undefined}
            >
              About
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Top Ad Slot */}
      <div className="container mx-auto px-4 py-6">
        <div className="ad-slot-placeholder w-full h-[90px] md:h-[120px] max-w-4xl mx-auto" />
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pb-12">
        {children}
      </main>

      {/* Bottom Ad Slot */}
      <div className="container mx-auto px-4 py-8">
        <div className="ad-slot-placeholder w-full h-[90px] max-w-4xl mx-auto" />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Headphones className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">FastYT</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                The fastest, most reliable online media converter on the web. High quality audio downloads in seconds, completely free.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-accent" /> Lightning Fast
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Secure
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground/70">
                  <span className="font-semibold text-foreground/80">Disclaimer:</span> This tool is for personal, non-commercial use only. Users must have the legal right to download content. We are not responsible for unauthorized use.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Video to MP3 Converter
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/convert-video-to-mp3" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Convert Video to MP3
                  </Link>
                </li>
                <li>
                  <Link href="/extract-audio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Extract Audio
                  </Link>
                </li>
                <li>
                  <Link href="/mp3-vs-wav" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    MP3 vs WAV Guide
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-convert" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Convert on Mobile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FastYT Media Converter. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-xl text-center md:text-right">
              This tool is for personal use only. Users must ensure they have rights to download content.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
