import React, { useState, useEffect, useCallback, useRef } from "react";
import { useGetVideoInfo, useConvertVideo } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/video-preview";
import { isValidMediaUrl, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import { Search, Loader2, Download, ArrowRight, Zap, CheckCircle2, Shield, Music, ClipboardPaste, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<"128" | "192" | "320">("192");
  const { t } = useI18n();
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const infoMutation = useGetVideoInfo();
  const convertMutation = useConvertVideo();

  // Set page metadata once
  useEffect(() => {
    document.title = "FastAudio Media Converter - Convert Media Files to High Quality Audio Online";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "FastAudio Media Converter lets you convert media files to high quality audio online for free. Fast, easy and secure audio conversion tool.");
    setMeta("keywords", "media converter, audio converter, convert media, audio extraction, online converter");
    setMeta("robots", "index, follow");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/");

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
  }, []);

  // Auto-fetch video info when valid URL is pasted with debounce
  useEffect(() => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    if (!isValidMediaUrl(url)) return;

    // Reset conversion if user changes URL
    if (convertMutation.isSuccess || convertMutation.isError) {
      convertMutation.reset();
    }
    if (infoMutation.isSuccess || infoMutation.isError) {
      infoMutation.reset();
    }

    fetchTimeoutRef.current = setTimeout(() => {
      infoMutation.mutate({ data: { url } });
    }, 500);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleConvert = useCallback(() => {
    if (!isValidMediaUrl(url)) return;
    convertMutation.mutate({ data: { url, quality } });
  }, [url, quality, convertMutation]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // Clipboard access denied — ignore silently
    }
  }, []);

  const handleReset = useCallback(() => {
    setUrl("");
    convertMutation.reset();
    infoMutation.reset();
  }, [convertMutation, infoMutation]);

  const isProcessing = infoMutation.isPending || convertMutation.isPending;
  const hasValidUrl = url && isValidMediaUrl(url);
  const hasInvalidUrl = url && !isValidMediaUrl(url);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 md:pt-14 lg:pt-20 pb-16">
        
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14 space-y-5 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <Zap className="w-3.5 h-3.5" /> {t("fastestConverterOnline")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight"
          >
            {t("heroTitle1")}{" "}
            <span className="text-gradient">{t("heroTitle2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>
        </div>

        {/* Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">

            {/* URL Input Row */}
            <div className="w-full">
              <div className={cn(
                "relative flex items-center border-2 rounded-2xl transition-all duration-200 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm shadow-sm",
                hasInvalidUrl
                  ? "border-destructive/50 shadow-destructive/10"
                  : "border-primary/30 hover:border-primary/60 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/15"
              )}>
                {/* Search Icon */}
                <div className="absolute left-4 sm:left-5 text-muted-foreground pointer-events-none flex-shrink-0">
                  <Search className="w-5 h-5" />
                </div>

                {/* Input */}
                <input
                  type="url"
                  placeholder={t("placeholder") || "Paste URL here to Download..."}
                  className="flex-1 h-14 sm:h-16 pl-12 sm:pl-14 pr-4 text-sm sm:text-base bg-transparent border-none outline-none placeholder-muted-foreground/50 text-foreground font-medium min-w-0"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isProcessing}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {/* Buttons */}
                <div className="flex items-center gap-2 pr-3 sm:pr-4 flex-shrink-0">
                  {!convertMutation.data && (
                    <>
                      <button
                        onClick={handlePaste}
                        disabled={isProcessing}
                        className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Paste</span>
                      </button>
                      <Button
                        variant="gradient"
                        className="h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                        onClick={handleConvert}
                        disabled={!hasValidUrl || isProcessing}
                      >
                        {convertMutation.isPending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <span className="hidden sm:inline">Convert</span>
                        }
                        {!convertMutation.isPending && <span className="sm:hidden">Go</span>}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Validation Error */}
              <AnimatePresence>
                {hasInvalidUrl && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-destructive text-sm mt-2 ml-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("validationError")}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Quality Selection (before preview loads) */}
            <AnimatePresence>
              {hasValidUrl && !infoMutation.data && !convertMutation.isSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5"
                >
                  <div className="p-5 bg-primary/5 border border-primary/15 rounded-xl">
                    <p className="text-xs sm:text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-primary" />
                      {t("selectAudioQuality")}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {(["128", "192", "320"] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          disabled={convertMutation.isPending}
                          className={cn(
                            "py-2.5 sm:py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer",
                            quality === q
                              ? "border-primary bg-primary/15 text-primary shadow-md scale-[1.02]"
                              : "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                          )}
                        >
                          {q} kbps
                        </button>
                      ))}
                    </div>
                    {infoMutation.isPending && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        Loading video info...
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic States */}
          <AnimatePresence mode="wait">

            {/* Preview + Settings State */}
            {infoMutation.isSuccess && infoMutation.data && !convertMutation.isSuccess && (
              <motion.div
                key="preview-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                <VideoPreview data={infoMutation.data} />

                <div className="glass-card rounded-2xl p-6 sm:p-8">
                  <h4 className="font-bold text-base sm:text-lg mb-5 flex items-center gap-2.5 text-foreground">
                    <span className="text-xl">🎵</span>
                    {t("selectAudioQuality")}
                  </h4>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {(["128", "192", "320"] as const).map((q) => (
                      <motion.button
                        key={q}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuality(q)}
                        disabled={convertMutation.isPending}
                        className={cn(
                          "py-4 sm:py-5 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                          quality === q
                            ? "border-primary bg-gradient-to-br from-primary/15 to-primary/8 text-primary shadow-lg shadow-primary/20 scale-[1.03]"
                            : "border-border/60 bg-background/60 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                        )}
                      >
                        <span className="text-lg sm:text-xl font-bold">{q}</span>
                        <span className="text-xs opacity-70 font-medium">{t("kbps")}</span>
                      </motion.button>
                    ))}
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
                        {t("convertMedia")}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Progress Bar */}
                  {convertMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-5 space-y-2"
                    >
                      <div className="flex justify-between text-xs font-medium text-primary">
                        <span>{t("processingMedia")}</span>
                        <span>Converting...</span>
                      </div>
                      <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 5, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Success / Download State */}
            {convertMutation.isSuccess && convertMutation.data && (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 text-center bg-green-500/5 border border-green-500/20 rounded-2xl p-8 sm:p-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5 text-green-500"
                >
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{t("conversionSuccessful")}</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base line-clamp-2">
                  {convertMutation.data.title}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <a
                    href={convertMutation.data.download}
                    download={`${convertMutation.data.title?.replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio"}.mp3`}
                    className="w-full sm:w-auto"
                  >
                    <Button variant="gradient" size="lg" className="w-full h-12 sm:h-14 text-base rounded-xl px-8 sm:px-12 shadow-lg">
                      <Download className="w-5 h-5 mr-2.5" />
                      {t("downloadMp3")}
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 sm:h-14 rounded-xl"
                    onClick={handleReset}
                  >
                    {t("convertAnother")}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {(convertMutation.isError || infoMutation.isError) && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 sm:p-6 bg-destructive/8 border border-destructive/20 rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-destructive mb-1">{t("errorOccurred")}</p>
                    <p className="text-sm text-muted-foreground">
                      {convertMutation.isError
                        ? "Conversion failed. The link may not be supported or has expired."
                        : "Could not load video info. Please check the URL and try again."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      convertMutation.reset();
                      infoMutation.reset();
                    }}
                  >
                    {t("tryAgain")}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto mt-10 px-4 py-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <strong>Important:</strong> {t("disclaimer_text")}
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {[
            { icon: Zap, color: "text-primary", bg: "bg-primary/10", title: t("instantConversions"), desc: t("instantConversionsDesc") },
            { icon: Music, color: "text-accent", bg: "bg-accent/10", title: t("highQualityAudio"), desc: t("highQualityAudioDesc") },
            { icon: Shield, color: "text-green-500", bg: "bg-green-500/10", title: t("safeSecure"), desc: t("safeSecureDesc") },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="p-5 sm:p-6 bg-card rounded-2xl border border-border/50 text-center hover:border-primary/30 hover:shadow-md transition-all">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4", bg, color)}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
