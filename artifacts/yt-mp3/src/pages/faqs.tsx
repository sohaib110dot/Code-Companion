import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function FAQs() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.faqs_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.faqs_intro);
    setMeta("keywords", "faqs, faq, frequently asked questions, video converter, mp3 conversion");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/faqs");
  }, [lang, t]);

  const faqs = [
    { q: t.faqs_q1, a: t.faqs_a1 },
    { q: t.faqs_q2, a: t.faqs_a2 },
    { q: t.faqs_q3, a: t.faqs_a3 },
    { q: t.faqs_q4, a: t.faqs_a4 },
    { q: t.faqs_q5, a: t.faqs_a5 },
    { q: t.faqs_q6, a: t.faqs_a6 },
    { q: t.faqs_q7, a: t.faqs_a7 },
    { q: t.faqs_q8, a: t.faqs_a8 },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.faqs_h1}</h1>

        <p className="text-muted-foreground mb-12">{t.faqs_intro}</p>

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
          <h3 className="font-bold mb-2 text-foreground">{t.faqs_still_questions}</h3>
          <p className="text-muted-foreground">
            <a href="/contact" className="text-primary hover:underline">{t.faqs_contact_link}</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
