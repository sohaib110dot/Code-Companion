import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Terms() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.terms_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.terms_intro.slice(0, 160));
    setMeta("keywords", "terms of service, terms and conditions, legal terms, user agreement, DMCA");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/terms");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.terms_h1}</h1>

        <p className="text-muted-foreground mb-8">{t.terms_last_updated}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>{t.terms_intro}</p>

        <h2>{t.terms_s1_title}</h2>
        <p>{t.terms_s1_body}</p>

        <h2>{t.terms_s2_title}</h2>
        <p>{t.terms_s2_body}</p>
        <p>{t.terms_s2_body2}</p>

        <h2>{t.terms_s3_title}</h2>
        <p><strong>{t.terms_s3_intro}</strong></p>
        <ul>
          <li>{t.terms_s3_li1}</li>
          <li>{t.terms_s3_li2}</li>
          <li>{t.terms_s3_li3}</li>
        </ul>
        <p>{t.terms_s3_warning}</p>

        <h2>{t.terms_s4_title}</h2>
        <p>{t.terms_s4_intro}</p>
        <ul>
          <li>{t.terms_s4_li1}</li>
          <li>{t.terms_s4_li2}</li>
          <li>{t.terms_s4_li3}</li>
          <li>{t.terms_s4_li4}</li>
          <li>{t.terms_s4_li5}</li>
          <li>{t.terms_s4_li6}</li>
          <li>{t.terms_s4_li7}</li>
        </ul>

        <h2>{t.terms_s5_title}</h2>
        <p>{t.terms_s5_body}</p>
        <p>{t.terms_s5_body2}</p>
        <div className="bg-card p-4 rounded-xl border border-border not-prose">
          <p className="text-sm font-mono"><strong>Copyright Agent:</strong> FastAudio Media Converter</p>
          <p className="text-sm font-mono"><strong>Email:</strong> sonujee@proton.me</p>
          <p className="text-sm font-mono"><strong>Subject line:</strong> DMCA Takedown Request</p>
        </div>

        <h2>{t.terms_s6_title}</h2>
        <p>{t.terms_s6_body}</p>

        <h2>{t.terms_s7_title}</h2>
        <p>{t.terms_s7_body}</p>

        <h2>{t.terms_s8_title}</h2>
        <p>{t.terms_s8_body}</p>

        <h2>{t.terms_s9_title}</h2>
        <p>{t.terms_s9_body}</p>

        <h2>{t.terms_s10_title}</h2>
        <p>{t.terms_s10_body}</p>

        <h2>{t.terms_s11_title}</h2>
        <p>{t.terms_s11_body}</p>

        <h2>{t.terms_s12_title}</h2>
        <p>{t.terms_s12_body}</p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">{t.terms_footer_note}</p>
      </div>
    </Layout>
  );
}
