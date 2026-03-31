import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function ExtractAudio() {
  const { lang, t: globalT } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.ea_title} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.ea_lead.slice(0, 160));
    setMeta("keywords", "extract audio, audio extraction, separate audio from video, video to audio");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/extract-audio");

    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script") as HTMLScriptElement;
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t.ea_title,
        "description": t.ea_lead,
        "url": "https://fastaudio.cc/extract-audio",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "extract audio, audio extraction, separate audio from video"
      });
      document.head.appendChild(articleScript);
    }
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.ea_title}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.ea_lead}</p>

        <h2>{t.ea_what_title}</h2>
        <p>{t.ea_what_body}</p>

        <h2>{t.ea_reasons_title}</h2>
        <ul>
          <li><strong>{t.ea_reason1.split("—")[0].trim()}</strong>{t.ea_reason1.includes("—") ? " — " + t.ea_reason1.split("—").slice(1).join("—").trim() : ""}</li>
          <li><strong>{t.ea_reason2.split("—")[0].trim()}</strong>{t.ea_reason2.includes("—") ? " — " + t.ea_reason2.split("—").slice(1).join("—").trim() : ""}</li>
          <li><strong>{t.ea_reason3.split("—")[0].trim()}</strong>{t.ea_reason3.includes("—") ? " — " + t.ea_reason3.split("—").slice(1).join("—").trim() : ""}</li>
          <li><strong>{t.ea_reason4.split("—")[0].trim()}</strong>{t.ea_reason4.includes("—") ? " — " + t.ea_reason4.split("—").slice(1).join("—").trim() : ""}</li>
          <li><strong>{t.ea_reason5.split("—")[0].trim()}</strong>{t.ea_reason5.includes("—") ? " — " + t.ea_reason5.split("—").slice(1).join("—").trim() : ""}</li>
        </ul>

        <h2>{t.ea_how_title}</h2>
        <p>{t.ea_how_body}</p>
        <ol>
          <li>{t.ea_step1}</li>
          <li>{t.ea_step2}</li>
          <li>{t.ea_step3}</li>
          <li>{t.ea_step4}</li>
          <li>{t.ea_step5}</li>
          <li>{t.ea_step6}</li>
        </ol>

        <h2>{t.ea_happens_title}</h2>
        <p>{t.ea_happens_body}</p>

        <h2>{t.ea_tips_title}</h2>
        <ul>
          <li>{t.ea_tip1}</li>
          <li>{t.ea_tip2}</li>
          <li>{t.ea_tip3}</li>
          <li>{t.ea_tip4}</li>
        </ul>

        <h2>{t.ea_cta_title}</h2>
        <p>{t.ea_cta_body}</p>
        <div className="not-prose my-8">
          <Link href="/" className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity">
            {t.ea_cta_btn}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> {t.ea_disclaimer}
        </p>
      </div>
    </Layout>
  );
}
