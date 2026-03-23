import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Headphones, DownloadCloud, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Fast<span className="text-primary">YT</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/about" ? "text-primary" : "text-muted-foreground"
              )}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === "/contact" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Contact
            </Link>
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
