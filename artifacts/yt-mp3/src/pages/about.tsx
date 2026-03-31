import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function About() {
  useEffect(() => {
    document.title = "About Us - FastAudio Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Learn about FastAudio Media Converter - the fastest and most reliable online tool for converting video to MP3. No registration required, completely free.");
    setMeta("keywords", "about fastaudio, converter tool, about us, company info");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/about");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">About FastAudio</h1>
        
        <p className="lead text-xl text-muted-foreground mb-8">
          FastAudio was built with a simple goal: to provide the fastest, cleanest, and most reliable way to convert media files to high quality audio.
        </p>
        
        <div className="bg-card p-8 rounded-2xl border border-border mb-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 mt-0">Our Mission</h2>
          <p className="mb-0">
            The internet is full of converter tools that are bloated with intrusive ads, malicious popups, and slow processing times. We wanted to build an alternative that respects the user's time and security. Our infrastructure leverages high-speed cloud servers to process audio extraction instantly, delivering high-quality audio files without the hassle.
          </p>
        </div>

        <h3>Why choose us?</h3>
        <ul>
          <li><strong>No Registration Required:</strong> We don't ask for your email or personal information.</li>
          <li><strong>Blazing Fast:</strong> Most conversions finish in under 3 seconds.</li>
          <li><strong>Quality Options:</strong> We don't force you into low quality. Choose up to 320kbps.</li>
          <li><strong>Mobile Friendly:</strong> Works perfectly on your smartphone, tablet, or desktop.</li>
        </ul>

        <h3>How to use the tool</h3>
        <ol>
          <li>Find the media you want to convert.</li>
          <li>Copy the media URL from your browser's address bar.</li>
          <li>Paste the URL into the search box on our homepage.</li>
          <li>Select your desired audio quality.</li>
          <li>Click Convert and wait a few seconds.</li>
          <li>Click Download to save the audio file to your device.</li>
        </ol>

        <hr className="my-10" />
        
        <p className="text-sm text-muted-foreground text-center">
          If you encounter any issues or have feedback, please check back soon as we are continually updating our platform.
        </p>
      </div>
    </Layout>
  );
}
