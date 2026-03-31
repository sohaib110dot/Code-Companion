import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Disclaimer() {
  useEffect(() => {
    document.title = "Disclaimer - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Important disclaimer for FastAudio Media Converter. This tool is for personal use only. Users are solely responsible for ensuring their use is legal.");
    setMeta("keywords", "disclaimer, legal notice, terms, usage rights, copyright notice");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.cc/disclaimer");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Disclaimer</h1>

        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="bg-card p-6 rounded-2xl border border-border not-prose mb-8">
          <p className="text-foreground font-semibold text-lg mb-2">Important Notice</p>
          <p className="text-muted-foreground">
            FastAudio Media Converter is a technical tool designed exclusively for <strong>personal, lawful use</strong>. Users are entirely and solely responsible for ensuring their use of this Service complies with all applicable laws and third-party terms of service.
          </p>
        </div>

        <h2>1. Personal Use Only</h2>
        <p>
          This Service is intended strictly for personal, non-commercial use. You may only use this tool to convert audio from content that you own the copyright to, have explicit permission to download, or that is freely available under a license permitting such use (e.g., Creative Commons, public domain).
        </p>
        <p>
          Commercial use, redistribution, or resale of converted audio files is strictly prohibited.
        </p>

        <h2>2. No Hosting or Distribution of Content</h2>
        <p>
          FastAudio does not host, store, upload, distribute, or transmit any third-party copyrighted content. Our Service functions as a technical conversion tool — we process URLs that are submitted by users and temporarily convert the audio component. All source content remains on the originating platform's servers at all times.
        </p>
        <p>
          Converted files are cached temporarily on our servers for immediate download and are automatically and permanently deleted within a short period. We retain no permanent copies of any converted media.
        </p>

        <h2>3. User Responsibility for Legal Compliance</h2>
        <p>
          By using this Service, you expressly acknowledge and agree that:
        </p>
        <ul>
          <li>You are solely responsible for verifying that you have the legal right to convert and download any content you submit</li>
          <li>Downloading or reproducing copyrighted content without authorization from the copyright owner may violate copyright laws in your jurisdiction</li>
          <li>You will not use this Service in any way that violates the terms of service of any third-party platform or website</li>
          <li>FastAudio bears no responsibility for any copyright infringement carried out by users of this Service</li>
        </ul>

        <h2>4. Intellectual Property Rights</h2>
        <p>
          All content available on third-party platforms is the property of its respective owners and is protected by applicable intellectual property laws. FastAudio does not claim ownership of, or rights to, any content submitted by users for conversion.
        </p>
        <p>
          If you are unsure whether you have the right to download specific content, we recommend consulting with a qualified legal professional before using this Service for that content.
        </p>

        <h2>5. Use at Your Own Risk</h2>
        <p>
          FastAudio Media Converter is provided on an "as-is" basis without warranties of any kind, either express or implied. We make no representations or warranties regarding:
        </p>
        <ul>
          <li>The accuracy, reliability, or completeness of the conversion output</li>
          <li>The availability or uninterrupted operation of the Service</li>
          <li>The legality of converting specific content in your jurisdiction</li>
        </ul>
        <p>
          Users assume all responsibility and risk for the use of this Service.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          FastAudio and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use or inability to use our Service, or any action taken in reliance upon information contained within our website. This includes, without limitation, damages arising from copyright infringement claims made against you as a result of your misuse of the Service.
        </p>

        <h2>7. Third-Party Platforms</h2>
        <p>
          FastAudio is an independent service and is not affiliated with, endorsed by, or sponsored by any video or content hosting platform. References to any platform are for informational purposes only. Users must independently comply with the terms of service of any platform whose content they choose to process.
        </p>

        <h2>8. Changes to This Disclaimer</h2>
        <p>
          We reserve the right to modify this disclaimer at any time without prior notice. Your continued use of the Service constitutes your acceptance of any changes.
        </p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">
          For questions or concerns, contact us at <strong>sonujee@proton.me</strong>. For copyright takedown requests, please see our <a href="/dmca" className="text-primary hover:underline">DMCA Policy</a>.
        </p>
      </div>
    </Layout>
  );
}
