import React, { useState, useEffect } from "react";
import { useGetVideoInfo, useConvertVideo } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/video-preview";
import { isValidYoutubeUrl, cn } from "@/lib/utils";
import { Search, Loader2, Download, ArrowRight, Zap, CheckCircle2, Shield, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<"128" | "192" | "320">("192");
  
  const infoMutation = useGetVideoInfo();
  const convertMutation = useConvertVideo();

  // Handle URL changes and auto-fetch preview
  useEffect(() => {
    document.title = "Fast YouTube to MP3 Converter - Free Online MP3 Download";
    
    if (isValidYoutubeUrl(url)) {
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
    if (!isValidYoutubeUrl(url)) return;
    convertMutation.mutate({ data: { url, quality } });
  };

  const isProcessing = infoMutation.isPending || convertMutation.isPending;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pt-10 md:pt-20 pb-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" /> The fastest converter online
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto leading-tight"
          >
            Convert Videos to <span className="text-gradient">High Quality MP3</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Paste your link below to instantly download audio in up to 320kbps. 
            No registration required, completely free.
          </motion.p>
        </div>

        {/* Main Converter Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6 md:p-8 relative z-10"
        >
          {/* Input Area */}
          <div className="relative group flex items-center">
            <div className="absolute left-4 z-10 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <Input 
              placeholder="Paste YouTube link here... (e.g. https://youtube.com/watch?v=...)" 
              className="pl-14 pr-32 h-16 text-lg rounded-2xl shadow-inner bg-background"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
            />
            
            {!infoMutation.data && !convertMutation.data && (
              <Button 
                variant="gradient" 
                className="absolute right-2 h-12 rounded-xl px-6"
                onClick={() => {
                  if (isValidYoutubeUrl(url)) {
                    infoMutation.mutate({ data: { url } });
                  }
                }}
                disabled={!url || isProcessing}
              >
                {infoMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start"}
              </Button>
            )}
          </div>

          {/* Validation Feedback */}
          {url && !isValidYoutubeUrl(url) && (
            <p className="text-destructive text-sm mt-3 ml-2 animate-in fade-in slide-in-from-top-2">
              Please enter a valid YouTube URL.
            </p>
          )}

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
                    Select Audio Quality
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(["128", "192", "320"] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        disabled={convertMutation.isPending}
                        className={cn(
                          "py-3 rounded-xl border-2 font-medium transition-all interactive-scale flex flex-col items-center justify-center gap-1",
                          quality === q 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border bg-background hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        <span className="text-lg">{q}</span>
                        <span className="text-xs opacity-80">kbps</span>
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
                          Converting...
                        </>
                      ) : (
                        <>
                          Convert Video <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Indicator (Fake visual during actual API call) */}
                  {convertMutation.isPending && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm font-medium text-primary">
                        <span>Processing audio track...</span>
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
                <h3 className="text-2xl font-bold mb-2">Conversion Successful!</h3>
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
                      Download MP3
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
                    Convert Another
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
                <p className="font-semibold mb-4">An error occurred during conversion.</p>
                <Button variant="outline" onClick={() => convertMutation.reset()}>
                  Try Again
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* Features Section below converter */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Conversions</h3>
            <p className="text-muted-foreground text-sm">Our powerful cloud servers process videos in seconds, not minutes.</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">High Quality Audio</h3>
            <p className="text-muted-foreground text-sm">Choose between 128kbps, 192kbps, or pristine 320kbps MP3 files.</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border/50 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Safe & Secure</h3>
            <p className="text-muted-foreground text-sm">No annoying popups, no required software. Completely safe to use.</p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
