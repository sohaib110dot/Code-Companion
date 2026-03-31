import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { ShieldCheck, Mail, AlertTriangle } from "lucide-react";

export default function DMCA() {
  useEffect(() => {
    document.title = "DMCA Policy - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "FastAudio Media Converter DMCA Policy. Learn how to submit a copyright takedown notice and how we handle intellectual property complaints.");
    setMeta("keywords", "DMCA, copyright, takedown notice, intellectual property, copyright infringement");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastyt.cc/dmca");

    let schemaScript = document.querySelector('script[data-type="dmca-schema"]');
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-type", "dmca-schema");
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "DMCA Policy - FastAudio Media Converter",
        "description": "FastAudio Media Converter DMCA Policy and Copyright Takedown Procedure",
        "url": "https://fastyt.cc/dmca",
        "publisher": {
          "@type": "Organization",
          "name": "FastAudio Media Converter"
        }
      });
      document.head.appendChild(schemaScript);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <div className="not-prose flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">DMCA Policy</h1>
        </div>

        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>
          FastAudio Media Converter takes copyright infringement seriously and complies fully with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512. We respect the intellectual property rights of all content creators and rights holders.
        </p>

        <h2>Our Commitment</h2>
        <p>
          FastAudio operates as a technical utility that processes URLs submitted by users. <strong>We do not host, upload, store, or distribute any copyrighted content.</strong> Our Service acts as a passive technical conduit. However, we understand the importance of protecting intellectual property and are committed to responding promptly to valid copyright claims.
        </p>

        <h2>How to Submit a DMCA Takedown Notice</h2>
        <p>
          If you are a copyright owner or an authorized representative and believe that a URL processed through our Service infringes your copyright, please send a written DMCA notice to our designated Copyright Agent:
        </p>

        <div className="not-prose bg-card p-6 rounded-2xl border border-border shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold text-foreground mb-1">Copyright Agent — FastAudio Media Converter</p>
              <p className="text-muted-foreground text-sm mb-2">Submit DMCA takedown requests to:</p>
              <p className="text-primary font-medium">sonujee@proton.me</p>
              <p className="text-muted-foreground text-sm mt-2">Subject line: <span className="font-mono bg-muted px-1 rounded">DMCA Takedown Request</span></p>
            </div>
          </div>
        </div>

        <h2>Required Information in Your Notice</h2>
        <p>Your DMCA notice must contain all of the following elements to be valid under 17 U.S.C. § 512(c)(3):</p>
        <ol>
          <li><strong>Physical or electronic signature</strong> of the copyright owner or a person authorized to act on their behalf</li>
          <li><strong>Identification of the copyrighted work(s)</strong> you claim has been infringed. If multiple works are covered by a single notice, provide a representative list</li>
          <li><strong>Identification of the infringing material</strong> — specifically, the URL(s) submitted through our Service that you believe infringes your copyright</li>
          <li><strong>Your contact information</strong>: full name, mailing address, telephone number, and email address</li>
          <li><strong>Good-faith belief statement:</strong> "I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</li>
          <li><strong>Accuracy statement under penalty of perjury:</strong> "I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed."</li>
        </ol>

        <div className="not-prose bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Warning:</strong> Under Section 512(f) of the DMCA, any person who knowingly and materially misrepresents that material is infringing may be subject to liability for damages. Do not submit false or misleading DMCA notices.
            </p>
          </div>
        </div>

        <h2>Our Response Process</h2>
        <p>Upon receipt of a complete and valid DMCA notice, we will:</p>
        <ol>
          <li>Acknowledge receipt of your complaint within 3 business days</li>
          <li>Review the notice for completeness and validity</li>
          <li>Block the reported URL(s) from being processed through our Service</li>
          <li>Notify the user who submitted the URL of the blocking action (where possible)</li>
        </ol>

        <h2>Counter-Notice Procedure</h2>
        <p>
          If you believe that content was incorrectly blocked as a result of a DMCA notice, you may send a counter-notice to our Copyright Agent at the address above. A valid counter-notice must contain:
        </p>
        <ol>
          <li>Your physical or electronic signature</li>
          <li>Identification of the material that was removed and where it appeared before removal</li>
          <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
          <li>Your name, address, telephone number, and a statement consenting to jurisdiction of the Federal District Court for your area</li>
        </ol>

        <h2>Repeat Infringer Policy</h2>
        <p>
          FastAudio will, in appropriate circumstances, block users who are found to be repeat infringers from using our Service.
        </p>

        <h2>User Responsibility</h2>
        <p>
          All users of FastAudio are required to comply with copyright law and our Terms of Service. By using our Service, you represent that you have the legal right to convert any content you submit. Downloading or converting copyrighted content without authorization is strictly prohibited and may expose you to civil and criminal liability.
        </p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">
          For questions about this DMCA Policy, contact us at <strong>sonujee@proton.me</strong>
        </p>
      </div>
    </Layout>
  );
}
