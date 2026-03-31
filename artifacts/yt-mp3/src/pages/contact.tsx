import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      const selector = `meta[${attr}="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", "Contact FastAudio Media Converter support team. Get help, report issues, or send feedback about our video to MP3 conversion tool.");
    setMeta("keywords", "contact us, support, customer service, feedback, help");
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://fastaudio.cc/contact");

    let faqScript = document.querySelector('script[data-type="faq-schema"]') as HTMLScriptElement | null;
    if (!faqScript) {
      faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.setAttribute("data-type", "faq-schema");
      faqScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why did my conversion fail?",
            "acceptedAnswer": {"@type": "Answer", "text": "Conversions may fail if the video is private, age-restricted, or longer than 20 minutes."}
          },
          {
            "@type": "Question",
            "name": "Is this tool free to use?",
            "acceptedAnswer": {"@type": "Answer", "text": "Yes. FastAudio Media Converter is completely free for personal use."}
          },
          {
            "@type": "Question",
            "name": "What audio quality options are available?",
            "acceptedAnswer": {"@type": "Answer", "text": "We offer 128 kbps, 192 kbps, and 320 kbps MP3 quality options."}
          }
        ]
      });
      document.head.appendChild(faqScript);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Contact Us</h1>

        <p className="lead text-xl text-muted-foreground mb-8">
          Have a question, suggestion, or issue? We'd love to hear from you. Reach out using any of the options below.
        </p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">General Inquiries</h3>
              <p className="text-muted-foreground text-sm">For general questions, feedback, or partnership requests.</p>
              <p className="text-primary font-medium mt-2 text-sm">sonujee@proton.me</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Technical Support</h3>
              <p className="text-muted-foreground text-sm">Experiencing an issue with a conversion? Let us know.</p>
              <p className="text-primary font-medium mt-2 text-sm">sonujee@proton.me</p>
            </div>
          </div>
        </div>

        <h2>Frequently Asked Questions</h2>

        <h3>Why did my conversion fail?</h3>
        <p>
          Conversions may fail if the video is private, age-restricted, or longer than 20 minutes. Make sure the video is publicly accessible and try again. If the problem persists, please contact our technical support.
        </p>

        <h3>Is this tool free to use?</h3>
        <p>
          Yes. FastAudio Media Converter is completely free for personal use. No registration, subscription, or payment is required.
        </p>

        <h3>What audio quality options are available?</h3>
        <p>
          We offer 128 kbps, 192 kbps, and 320 kbps MP3 quality options. For the best listening experience, we recommend 320 kbps.
        </p>

        <h3>How long are converted files stored?</h3>
        <p>
          Converted files are temporarily cached on our servers for immediate download and are automatically deleted within one hour. We do not permanently store any media files.
        </p>

        <div className="not-prose bg-card/50 border border-border rounded-2xl p-6 mt-10">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This tool is for personal use only. Users must ensure they have the rights to download any content they convert. Please review our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> before using the service.
          </p>
        </div>
      </div>
    </Layout>
  );
}
