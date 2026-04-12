import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Mail, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Contact() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.contact_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.contact_lead);
    setMeta("keywords", "contact us, support, customer service, feedback, help");
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/contact");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.contact_h1}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.contact_lead}</p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{t.contact_general_title}</h3>
              <p className="text-muted-foreground text-sm">{t.contact_general_desc}</p>
              <p className="text-primary font-medium mt-2 text-sm">sonujee@proton.me</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{t.contact_support_title}</h3>
              <p className="text-muted-foreground text-sm">{t.contact_support_desc}</p>
              <p className="text-primary font-medium mt-2 text-sm">sonujee@proton.me</p>
            </div>
          </div>
        </div>

        <h2>{t.contact_faq_title}</h2>

        <h3>{t.contact_faq_q1}</h3>
        <p>{t.contact_faq_a1}</p>

        <h3>{t.contact_faq_q2}</h3>
        <p>{t.contact_faq_a2}</p>

        <h3>{t.contact_faq_q3}</h3>
        <p>{t.contact_faq_a3}</p>

        <h3>{t.contact_faq_q4}</h3>
        <p>{t.contact_faq_a4}</p>

        <div className="not-prose bg-card/50 border border-border rounded-2xl p-6 mt-10">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> {t.contact_disclaimer_text}{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> &amp;{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
