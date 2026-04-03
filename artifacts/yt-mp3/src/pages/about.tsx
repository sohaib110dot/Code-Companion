import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function About() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.about_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.about_lead);
    setMeta("keywords", "about fastaudio, converter tool, about us, company info");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/about");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.about_h1}</h1>
        
        <p className="lead text-xl text-muted-foreground mb-8">{t.about_lead}</p>
        
        <div className="bg-card p-8 rounded-2xl border border-border mb-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 mt-0">{t.about_mission_title}</h2>
          <p className="mb-0">{t.about_mission_body}</p>
        </div>

        <h3>{t.about_why_title}</h3>
        <ul>
          <li><strong>{t.about_why_1.split(":")[0]}:</strong> {t.about_why_1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.about_why_2.split(":")[0]}:</strong> {t.about_why_2.split(":").slice(1).join(":")}</li>
          <li><strong>{t.about_why_3.split(":")[0]}:</strong> {t.about_why_3.split(":").slice(1).join(":")}</li>
          <li><strong>{t.about_why_4.split(":")[0]}:</strong> {t.about_why_4.split(":").slice(1).join(":")}</li>
        </ul>

        <h3>{t.about_how_title}</h3>
        <ol>
          <li>{t.about_step_1}</li>
          <li>{t.about_step_2}</li>
          <li>{t.about_step_3}</li>
          <li>{t.about_step_4}</li>
          <li>{t.about_step_5}</li>
          <li>{t.about_step_6}</li>
        </ol>

        <hr className="my-10" />
        
        <p className="text-sm text-muted-foreground text-center">{t.about_footer_note}</p>
      </div>
    </Layout>
  );
}
