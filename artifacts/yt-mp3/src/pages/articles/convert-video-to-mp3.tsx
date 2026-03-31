import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";

export default function ConvertVideoToMp3() {
  useEffect(() => {
    document.title = "How to Convert Video to MP3 Online - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Learn how to convert video to MP3 online for free. Step-by-step guide for extracting high-quality audio from videos without software.");
    setMeta("keywords", "convert video to mp3, how to convert, online conversion, video to audio");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.cc/convert-video-to-mp3");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Convert Video to MP3 Online",
        "description": "Learn how to convert video to MP3 online for free. Step-by-step guide for extracting high-quality audio from videos without software.",
        "url": "https://fastyt.cc/convert-video-to-mp3",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "convert video to mp3, how to convert, online conversion"
      });
      document.head.appendChild(articleScript);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">How to Convert Video to MP3 Online</h1>

        <p className="lead text-xl text-muted-foreground mb-8">
          Converting video to MP3 online has never been easier. With the right tool, you can extract high-quality audio from any publicly available video in just seconds — no downloads, no sign-ups.
        </p>

        <h2>Why Convert Video to MP3?</h2>
        <p>
          There are many practical reasons to convert video content into audio. Whether you're saving a podcast-style interview, a music performance, a language lesson, or a conference talk, having an MP3 file means you can listen anywhere — even offline. Audio files are smaller, easier to transfer, and compatible with virtually every device and media player.
        </p>

        <h2>What You Need</h2>
        <p>
          To convert a video to MP3 online, all you need is:
        </p>
        <ul>
          <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>The URL of the video you want to convert</li>
          <li>An internet connection</li>
        </ul>
        <p>No software installation is required when using an online converter like FastAudio Media Converter.</p>

        <h2>Step-by-Step: How to Convert Video to MP3</h2>
        <ol>
          <li><strong>Copy the video URL</strong> from your browser's address bar.</li>
          <li><strong>Visit FastAudio Media Converter</strong> at the homepage.</li>
          <li><strong>Paste the URL</strong> into the input box and click "Start".</li>
          <li><strong>Choose your audio quality</strong> — 128 kbps, 192 kbps, or 320 kbps.</li>
          <li><strong>Click "Convert Video"</strong> and wait a few moments.</li>
          <li><strong>Download your MP3</strong> with a single click.</li>
        </ol>

        <h2>Choosing the Right Audio Bitrate</h2>
        <p>
          The audio quality you choose affects both the file size and sound clarity:
        </p>
        <ul>
          <li><strong>128 kbps</strong> — Suitable for spoken word, podcasts, or when storage is limited.</li>
          <li><strong>192 kbps</strong> — A balanced choice for most music and general audio.</li>
          <li><strong>320 kbps</strong> — The highest quality available; ideal for music enthusiasts.</li>
        </ul>

        <h2>Tips for a Smooth Conversion</h2>
        <p>
          For the best experience when converting video to MP3, keep these tips in mind:
        </p>
        <ul>
          <li>Make sure the video is publicly accessible before converting.</li>
          <li>Videos longer than 20 minutes may take additional processing time.</li>
          <li>Use a stable internet connection for faster processing.</li>
          <li>Only convert content you have the rights to use.</li>
        </ul>

        <h2>Start Converting Now</h2>
        <p>
          Ready to extract audio from your favourite video? Our fast, free tool makes it simple.
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
