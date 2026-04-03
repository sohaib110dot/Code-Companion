import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Disclaimer() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.disclaimer_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.disclaimer_notice_body.slice(0, 160));
    setMeta("keywords", "disclaimer, legal notice, terms, usage rights, copyright notice");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/disclaimer");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.disclaimer_h1}</h1>

        <p className="text-muted-foreground mb-8">{t.disclaimer_last_updated}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="bg-card p-6 rounded-2xl border border-border not-prose mb-8">
          <p className="text-foreground font-semibold text-lg mb-2">{t.disclaimer_notice_title}</p>
          <p className="text-muted-foreground">{t.disclaimer_notice_body}</p>
        </div>

        <h2>{t.disclaimer_s1_title}</h2>
        <p>{t.disclaimer_s1_body}</p>
        <p>{t.disclaimer_s1_body2}</p>

        <h2>{t.disclaimer_s2_title}</h2>
        <p>{t.disclaimer_s2_body}</p>
        <p>{t.disclaimer_s2_body2}</p>

        <h2>{t.disclaimer_s3_title}</h2>
        <p>{t.disclaimer_s3_intro}</p>
        <ul>
          <li>{t.disclaimer_s3_li1}</li>
          <li>{t.disclaimer_s3_li2}</li>
          <li>{t.disclaimer_s3_li3}</li>
          <li>{t.disclaimer_s3_li4}</li>
        </ul>

        <h2>{t.disclaimer_s4_title}</h2>
        <p>{t.disclaimer_s4_body}</p>
        <p>{t.disclaimer_s4_body2}</p>

        <h2>{t.disclaimer_s5_title}</h2>
        <p>{t.disclaimer_s5_intro}</p>
        <ul>
          <li>{t.disclaimer_s5_li1}</li>
          <li>{t.disclaimer_s5_li2}</li>
          <li>{t.disclaimer_s5_li3}</li>
        </ul>
        <p>{t.disclaimer_s5_body2}</p>

        <h2>{t.disclaimer_s6_title}</h2>
        <p>{t.disclaimer_s6_body}</p>

        <h2>{t.disclaimer_s7_title}</h2>
        <p>{t.disclaimer_s7_body}</p>

        <h2>{t.disclaimer_s8_title}</h2>
        <p>{t.disclaimer_s8_body}</p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">
          {t.disclaimer_footer_note}
        </p>
      </div>
    </Layout>
  );
}
