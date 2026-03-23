import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";

export default function ExtractAudio() {
  useEffect(() => {
    document.title = "How to Extract Audio from a Video - FastYT Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Learn how to extract audio from video files easily. Complete guide to isolating sound tracks and saving as MP3 with our free online tool.");
    setMeta("keywords", "extract audio, audio extraction, separate audio from video, video to audio, sound extraction");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.io/extract-audio");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Extract Audio from a Video",
        "description": "Learn how to extract audio from video files easily. Complete guide to isolating sound tracks and saving as MP3.",
        "url": "https://fastyt.io/extract-audio",
        "author": {"@type": "Organization", "name": "FastYT"},
        "datePublished": "2026-03-23",
        "keywords": "extract audio, audio extraction, separate audio from video"
      });
      document.head.appendChild(articleScript);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">How to Extract Audio from a Video</h1>

        <p className="lead text-xl text-muted-foreground mb-8">
          Extracting audio from a video means isolating the sound track and saving it as a standalone audio file like MP3. It's a common task for educators, content creators, music fans, and language learners.
        </p>

        <h2>What Does "Extracting Audio" Mean?</h2>
        <p>
          A video file contains two separate streams of data: the video (picture) stream and the audio (sound) stream. When you extract audio, you take only the sound component and save it independently — discarding the visual portion entirely. The result is an audio file you can listen to on any device, import into a music app, or use for other personal purposes.
        </p>

        <h2>Common Reasons to Extract Audio</h2>
        <ul>
          <li><strong>Music and concerts</strong> — Save audio from live performance videos for offline listening.</li>
          <li><strong>Podcasts and interviews</strong> — Extract the audio from video podcasts posted online.</li>
          <li><strong>Language learning</strong> — Pull audio from educational videos to practise listening on the go.</li>
          <li><strong>Lecture recordings</strong> — Extract audio from recorded university or training sessions.</li>
          <li><strong>Sound design</strong> — Source ambient sounds and effects from video content you own or have rights to.</li>
        </ul>

        <h2>How to Extract Audio Using FastYT</h2>
        <p>
          Our online tool makes audio extraction straightforward, with no technical knowledge required.
        </p>
        <ol>
          <li><strong>Find the video</strong> you want to extract audio from and copy its URL.</li>
          <li><strong>Open FastYT Media Converter</strong> in your browser.</li>
          <li><strong>Paste the URL</strong> into the converter input field.</li>
          <li><strong>Select your preferred quality</strong>: 128 kbps, 192 kbps, or 320 kbps.</li>
          <li><strong>Click "Convert Video"</strong> — our servers handle the extraction.</li>
          <li><strong>Download the MP3</strong> to your device.</li>
        </ol>

        <h2>What Happens During Extraction?</h2>
        <p>
          Our servers fetch the video's audio stream from the source, process it through a media pipeline, and encode it as an MP3 file at the bitrate you selected. This happens entirely in the cloud — your device does not download the video. You receive the finished audio file directly.
        </p>

        <h2>Tips for Best Results</h2>
        <ul>
          <li>Choose a higher bitrate (192 or 320 kbps) for music to preserve sound quality.</li>
          <li>For speech or podcasts, 128 kbps is usually more than sufficient.</li>
          <li>Make sure the source video has clear, high-quality audio — our tool cannot improve audio that was poor to begin with.</li>
          <li>Keep conversions to videos you own or have permission to use.</li>
        </ul>

        <h2>Extract Your Audio Now</h2>
        <p>
          Start extracting audio in seconds — no account needed, no software to install.
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
