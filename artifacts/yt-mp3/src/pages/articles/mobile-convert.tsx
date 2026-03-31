import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";

export default function MobileConvert() {
  useEffect(() => {
    document.title = "How to Convert Video to MP3 on Mobile - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Convert video to MP3 on your phone. Easy guide for iOS and Android users to extract audio from videos using our mobile-friendly online converter.");
    setMeta("keywords", "mobile conversion, convert on phone, iphone, android, mobile converter, convert on ipad");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.io/mobile-convert");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Convert Video to MP3 on Mobile",
        "description": "Convert video to MP3 on your phone. Easy guide for iOS and Android users to extract audio from videos.",
        "url": "https://fastyt.io/mobile-convert",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "mobile conversion, convert on phone, iphone, android"
      });
      document.head.appendChild(articleScript);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">How to Convert Video to MP3 on Your Phone</h1>

        <p className="lead text-xl text-muted-foreground mb-8">
          You don't need a computer to convert video to MP3. With a mobile-friendly online converter, you can do it right from your smartphone or tablet — on iOS or Android.
        </p>

        <h2>Can You Convert Video to MP3 on a Phone?</h2>
        <p>
          Absolutely. Online converters that work in a browser are fully compatible with mobile devices. Since all the processing happens on remote servers, your phone only needs to send a URL and receive a download — tasks any modern smartphone handles effortlessly.
        </p>
        <p>
          FastYT Media Converter is designed to be fully responsive, meaning it looks and works great on every screen size, from compact phones to large tablets.
        </p>

        <h2>How to Convert Video to MP3 on iPhone (iOS)</h2>
        <ol>
          <li>Open the <strong>Safari browser</strong> on your iPhone or iPad.</li>
          <li>Navigate to the video you want to convert and <strong>copy the URL</strong> from the address bar.</li>
          <li>Open <strong>FastAudio Media Converter</strong> in a new tab.</li>
          <li><strong>Paste the URL</strong> into the input box and tap "Start".</li>
          <li>Select your <strong>audio quality</strong> and tap "Convert Video".</li>
          <li>Once conversion is complete, tap <strong>"Download MP3"</strong>. The file will be saved to your Files app or Downloads folder.</li>
        </ol>

        <h2>How to Convert Video to MP3 on Android</h2>
        <ol>
          <li>Open <strong>Chrome</strong> (or your preferred browser) on your Android device.</li>
          <li>Find the video you want to convert and <strong>copy its URL</strong>.</li>
          <li>Go to <strong>FastAudio Media Converter</strong> in your browser.</li>
          <li><strong>Paste the URL</strong> and tap "Start".</li>
          <li>Choose your preferred <strong>bitrate</strong> and tap "Convert Video".</li>
          <li>Tap <strong>"Download MP3"</strong> — the file will save to your device's Downloads folder.</li>
        </ol>

        <h2>Tips for Mobile Conversion</h2>
        <ul>
          <li><strong>Use Wi-Fi</strong> where possible to avoid using mobile data during the download.</li>
          <li><strong>Keep your screen on</strong> during conversion so your browser doesn't go to sleep mid-process.</li>
          <li>If the download doesn't start automatically, tap the download button again or check your notification bar.</li>
          <li>On iPhone, you may need to use the <strong>Share &gt; Save to Files</strong> option to store the MP3 locally.</li>
        </ul>

        <h2>Why Use FastAudio on Mobile?</h2>
        <ul>
          <li>No app download required — works directly in your browser.</li>
          <li>Optimised layout for touch screens.</li>
          <li>Fast conversion powered by cloud servers, not your phone's CPU.</li>
          <li>Free to use, with no account or subscription needed.</li>
        </ul>

        <h2>Ready to Try It?</h2>
        <p>
          Open our converter right now on your phone and get your MP3 in seconds.
        </p>
        <div className="not-prose my-8">
          <Link
            href="/"
            className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            Try our free media converter tool →
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> This tool is for personal use only. Users must ensure they have rights to download content.
        </p>
      </div>
    </Layout>
  );
}
