import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service - FastAudio Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "FastAudio Converter Terms of Service. Understand the rules, copyright policy, and acceptable use of our media conversion tool.");
    setMeta("keywords", "terms of service, terms and conditions, legal terms, user agreement");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.io/terms");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and using FastAudio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
        </p>

        <h3>2. Description of Service</h3>
        <p>
          FastAudio provides a web-based utility that allows users to convert publicly available videos into downloadable MP3 audio files. The service is provided "AS IS" and "AS AVAILABLE" for personal, non-commercial use only.
        </p>

        <h3>3. Copyright and Acceptable Use</h3>
        <p>
          FastAudio respects the intellectual property rights of others. You agree to use the service <strong>only for content that you own, or for which you have explicit permission from the copyright owner to download and convert.</strong>
        </p>
        <p>
          You agree NOT to use the service to download copyrighted material without permission. We do not host, store, or distribute any copyrighted material. The tool simply acts as a conduit to extract audio from URLs provided by the user. If you are a copyright owner and believe your content is being misused, please note that we do not host the files, but you may contact us to block specific URLs from being processed.
        </p>

        <h3>4. User Conduct</h3>
        <p>You agree not to use the service to:</p>
        <ul>
          <li>Violate any local, state, national or international law</li>
          <li>Interfere with or disrupt the service or servers connected to the service</li>
          <li>Attempt to gain unauthorized access to the service or bypass our security measures</li>
          <li>Use automated scripts, bots, or scrapers to access the service heavily, which degrades performance for human users</li>
        </ul>

        <h3>5. Disclaimer of Warranties</h3>
        <p>
          Your use of the service is at your sole risk. FastYT expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
        </p>

        <h3>6. Limitation of Liability</h3>
        <p>
          FastYT shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from the use or the inability to use the service.
        </p>
      </div>
    </Layout>
  );
}
