import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function FAQs() {
  useEffect(() => {
    document.title = "FAQs - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Frequently asked questions about FastAudio Media Converter. Get answers to common questions about converting videos to MP3.");
    setMeta("keywords", "faqs, faq, frequently asked questions, video converter, mp3 conversion");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/faqs");
  }, []);

  const faqs = [
    {
      q: "How do I convert media to audio?",
      a: "Simply paste the media URL into the converter, select your preferred audio quality (128kbps, 192kbps, or 320kbps), and click 'Convert Media'. Your audio file will be ready to download within seconds."
    },
    {
      q: "Is FastAudio converter free?",
      a: "Yes! FastAudio Media Converter is completely free to use. No registration, no hidden fees, no annoying ads. Just convert your media to audio instantly."
    },
    {
      q: "What media formats are supported?",
      a: "We support most popular media platforms. Simply paste the media URL and our tool will automatically detect and convert it to high-quality audio."
    },
    {
      q: "Do you store my files?",
      a: "No, we do not store any files. Your media is converted on our secure servers and deleted immediately after download. Your privacy is guaranteed."
    },
    {
      q: "What audio quality options are available?",
      a: "We offer three quality levels: 128kbps (standard), 192kbps (high), and 320kbps (maximum quality). Choose based on your needs and device storage."
    },
    {
      q: "How long does the conversion take?",
      a: "Most conversions complete within seconds. The time depends on the media length and our server load. Typically, you'll have your audio ready in 15-30 seconds."
    },
    {
      q: "Can I convert media from other platforms?",
      a: "Yes! We support most major media platforms including Vimeo, TikTok, Instagram, and more."
    },
    {
      q: "Is my download secure?",
      a: "Absolutely. All conversions happen on secure servers, and files are automatically deleted after download. We never store or track your data."
    }
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Frequently Asked Questions</h1>

        <p className="text-muted-foreground mb-12">
          Have questions about FastAudio Media Converter? Find answers to the most common questions below.
        </p>

        <div className="space-y-6">
          {faqs.map((item, idx) => (
            <details key={idx} className="group p-6 bg-card rounded-xl border border-border/50 cursor-pointer hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-foreground text-lg">
                <span>{item.q}</span>
                <span className="text-primary group-open:rotate-180 transition-transform ml-4">▼</span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
          <h3 className="font-bold mb-2 text-foreground">Still have questions?</h3>
          <p className="text-muted-foreground">
            Visit our <a href="/contact" className="text-primary hover:underline">contact page</a> to reach out to our support team.
          </p>
        </div>
      </div>
    </Layout>
  );
}
