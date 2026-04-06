import React, { useState, useEffect } from "react";
import { useGetVideoInfo, useConvertVideo } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/video-preview";
import { isValidMediaUrl, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import { Search, Loader2, Download, ArrowRight, Zap, CheckCircle2, Shield, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<"128" | "192" | "320">("192");
  const { lang, t } = useI18n();
  
  const infoMutation = useGetVideoInfo();
  const convertMutation = useConvertVideo();

  // Handle URL changes and auto-fetch preview
  useEffect(() => {
    document.title = "FastAudio Media Converter - Convert Media Files to High Quality Audio Online";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "FastAudio Media Converter lets you convert media files to high quality audio online for free. Fast, easy and secure audio conversion tool for personal use.");
    setMeta("keywords", "media converter, audio converter, convert media, audio extraction, online converter, audio processing");
    setMeta("robots", "index, follow");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/");
    
    // JSON-LD Structured Data for SoftwareApplication
    let schemaScript = document.querySelector('script[data-type="application-schema"]');
    if (!schemaScript) {
      schemaScript = document.createElement("script") as HTMLScriptElement;
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-type", "application-schema");
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "FastAudio Media Converter",
        "description": "Free online tool to convert media files to high quality audio. No registration required.",
        "url": "https://fastaudio.cc",
        "applicationCategory": "MultimediaApplication",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "1250"}
      });
      document.head.appendChild(schemaScript);
    }

    if (isValidMediaUrl(url)) {
      // Avoid refetching if we already have it for this exact URL (basic check)
      if (!infoMutation.isPending && !convertMutation.isSuccess) {
        infoMutation.mutate({ data: { url } });
      }
      // Reset conversion state if user pastes a new URL
      if (convertMutation.isSuccess || convertMutation.isError) {
        convertMutation.reset();
      }
    }
  }, [url]);

  const handleConvert = () => {
    if (!isValidMediaUrl(url)) return;
    convertMutation.mutate({ data: { url, quality } });
  };

  const isProcessing = infoMutation.isPending || convertMutation.isPending;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 lg:pt-24 pb-12 md:pb-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 md:space-y-10 mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" /> {t("fastestConverterOnline")}
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            {t("heroTitle1")} <span className="text-gradient block sm:inline">{t("heroTitle2")}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>
        </div>

        {/* Main Converter Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative z-10">
            {/* Input Area - Responsive Layout */}
            <div className="w-full">
              <div className="relative group border-2 sm:border-3 border-primary/30 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-card/60 to-card/40 hover:border-primary/60 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-150 shadow-md sm:shadow-lg backdrop-blur-sm">
                <div className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 z-10 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none duration-200">
                  <Search className="w-6 sm:w-7 h-6 sm:h-7" />
                </div>
                <Input 
                  placeholder="Paste URL here to Download..."
                  className="w-full h-16 sm:h-20 pl-16 sm:pl-24 pr-40 sm:pr-56 text-base sm:text-lg md:text-xl rounded-2xl sm:rounded-3xl bg-transparent border-none outline-none placeholder-muted-foreground/50 focus:outline-none focus:ring-0 focus-visible:ring-0 align-middle leading-tight font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isProcessing}
                />
                
                {/* Button Group - Right Side */}
                {!convertMutation.data && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex gap-2 sm:gap-2.5 items-center">
                    <button
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setUrl(text);
                        } catch (err) {
                          console.error('Failed to read clipboard:', err);
                        }
                      }}
                      disabled={isProcessing}
                      className="h-11 sm:h-12 md:h-14 rounded-lg px-3 sm:px-4 font-semibold text-xs sm:text-sm text-primary bg-primary/10 hover:bg-primary/20 hover:shadow-md disabled:opacity-50 transition-all duration-150 active:scale-95"
                    >
                      Paste
                    </button>
                    <Button 
                      variant="gradient" 
                      className="h-11 sm:h-12 md:h-14 rounded-lg px-6 sm:px-7 md:px-9 font-semibold whitespace-nowrap text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95"
                      onClick={() => {
                        if (isValidMediaUrl(url)) {
                          convertMutation.mutate({ data: { url, quality } });
                        }
                      }}
                      disabled={!url || isProcessing}
                    >
                      {convertMutation.isPending ? <Loader2 className="w-4 sm:w-4 h-4 sm:h-4 animate-spin mr-1.5" /> : null}
                      <span className="hidden sm:inline">{convertMutation.isPending ? t("converting") : "Convert"}</span>
                      <span className="sm:hidden">{convertMutation.isPending ? "..." : "Go"}</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Validation Feedback */}
              {url && !isValidMediaUrl(url) && (
                <p className="text-destructive text-sm mt-3 ml-2 animate-in fade-in slide-in-from-top-2">
                  {t("validationError")}
                </p>
              )}
            </div>

            {/* Quality Selection - User Friendly */}
            {url && isValidMediaUrl(url) && !infoMutation.data && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20 shadow-md"
              >
                <p className="text-sm font-bold text-foreground mb-4">✨ Select Your Audio Quality:</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["128", "192", "320"] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      disabled={convertMutation.isPending}
                      className={cn(
                        "py-3 sm:py-4 rounded-lg border-2 font-semibold transition-all text-xs sm:text-sm md:text-base cursor-pointer",
                        quality === q 
                          ? "border-primary bg-primary/15 text-primary shadow-lg shadow-primary/20 scale-105" 
                          : "border-border/50 bg-background hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary"
                      )}
                    >
                      {q} kbps
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Dynamic Content Area (Preview, Settings, Results) */}
          <AnimatePresence mode="wait">
            
            {/* 1. Preview & Settings State */}
            {infoMutation.data && !convertMutation.isSuccess && (
              <motion.div 
                key="preview-state"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 space-y-8"
              >
                <VideoPreview data={infoMutation.data} />
                
                <div className="bg-background/50 rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    {t("selectAudioQuality")}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(["128", "192", "320"] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        disabled={convertMutation.isPending}
                        className={cn(
                          "w-24 h-24 rounded-xl border-2 font-medium transition-all interactive-scale flex flex-col items-center justify-center gap-1",
                          quality === q 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border bg-background hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        <span className="text-lg font-semibold">{q}</span>
                        <span className="text-xs opacity-80">{t("kbps")}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      className="w-full md:w-auto"
                      onClick={handleConvert}
                      disabled={convertMutation.isPending}
                    >
                      {convertMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t("converting")}
                        </>
                      ) : (
                        <>
                          {t("convertMedia")} <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Indicator (Fake visual during actual API call) */}
                  {convertMutation.isPending && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm font-medium text-primary">
                        <span>{t("processingMedia")}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: "0%" }}
                          animate={{ width: "90%" }}
                          transition={{ duration: 4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. Success / Download State */}
            {convertMutation.isSuccess && convertMutation.data && (
              <motion.div 
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center bg-green-500/5 border border-green-500/20 rounded-2xl p-8 md:p-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t("conversionSuccessful")}</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto line-clamp-2">
                  {convertMutation.data.title}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href={convertMutation.data.download} 
                    download
                    className="w-full sm:w-auto"
                  >
                    <Button variant="gradient" size="lg" className="w-full h-16 text-lg rounded-2xl px-12 shadow-glow">
                      <Download className="w-6 h-6 mr-3" />
                      {t("downloadMp3")}
                    </Button>
                  </a>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto h-16 rounded-2xl"
                    onClick={() => {
                      setUrl("");
                      convertMutation.reset();
                      infoMutation.reset();
                    }}
                  >
                    {t("convertAnother")}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 3. Error State */}
            {convertMutation.isError && (
              <motion.div 
                key="error-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-center text-destructive"
              >
                <p className="font-semibold mb-4">{t("errorOccurred")}</p>
                <Button variant="outline" onClick={() => convertMutation.reset()}>
                  {t("tryAgain")}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* Disclaimer Section */}
        <div className="max-w-3xl mx-auto mt-12 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> {t("disclaimer_text")}
          </p>
        </div>

        {/* Features Section below converter */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("instantConversions")}</h3>
            <p className="text-muted-foreground text-sm">{t("instantConversionsDesc")}</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("highQualityAudio")}</h3>
            <p className="text-muted-foreground text-sm">{t("highQualityAudioDesc")}</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("safeSecure")}</h3>
            <p className="text-muted-foreground text-sm">{t("safeSecureDesc")}</p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
