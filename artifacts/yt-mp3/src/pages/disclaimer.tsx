import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Disclaimer() {
  useEffect(() => {
    document.title = "Disclaimer - FastYT Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Disclaimer for FastYT Media Converter. Important legal information about usage rights and limitations.");
    setMeta("keywords", "disclaimer, legal, terms, usage rights");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.io/disclaimer");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Disclaimer</h1>

        <p>
          This tool is provided for personal use only.
        </p>

        <p>
          Users must ensure they have the legal right to download or convert any content.
        </p>

        <p>
          We do not host or store any media files.
        </p>

        <p>
          We are not responsible for misuse of this service.
        </p>

        <h3>Use at Your Own Risk</h3>
        <p>
          FastYT Media Converter is provided on an "as-is" basis. We make no warranties regarding the service, and we shall not be liable for any damages arising from the use of this tool. Users assume all responsibility and risk for the use of this service.
        </p>

        <h3>Intellectual Property</h3>
        <p>
          You are solely responsible for ensuring that you have the necessary rights to download, convert, or use any content processed through our service. Downloading copyrighted content without proper authorization may violate copyright laws and intellectual property rights.
        </p>

        <h3>Limitation of Liability</h3>
        <p>
          FastYT is not liable for any direct, indirect, incidental, special, or consequential damages resulting from your use or inability to use our service, or any action taken in reliance upon information contained within our website.
        </p>

        <h3>Changes to Terms</h3>
        <p>
          We reserve the right to modify this disclaimer at any time without notice. Your continued use of the service constitutes your acceptance of any changes.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </Layout>
  );
}
