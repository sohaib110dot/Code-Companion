import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function ConvertWithoutSoftware() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.cws_title} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.cws_lead.slice(0, 160));
    setMeta("keywords", "convert without software, online converter, browser-based, no installation");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/convert-without-software");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t.cws_title,
        "description": t.cws_lead,
        "url": "https://fastaudio.cc/convert-without-software",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "convert without software, online converter, browser-based"
      });
      document.head.appendChild(articleScript);
    }
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.cws_title}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.cws_lead}</p>

        <h2>{t.cws_problem_title}</h2>
        <p>{t.cws_problem_p1}</p>
        <p>{t.cws_problem_p2}</p>

        <h2>{t.cws_benefits_title}</h2>
        <ul>
          <li>{t.cws_benefit1}</li>
          <li>{t.cws_benefit2}</li>
          <li>{t.cws_benefit3}</li>
          <li>{t.cws_benefit4}</li>
          <li>{t.cws_benefit5}</li>
        </ul>

        <h2>{t.cws_how_title}</h2>
        <p>{t.cws_how_body}</p>

        <h2>{t.cws_safe_title}</h2>
        <p>{t.cws_safe_body}</p>

        <h2>{t.cws_when_title}</h2>
        <p>{t.cws_when_body}</p>
        <ul>
          <li>{t.cws_when_li1}</li>
          <li>{t.cws_when_li2}</li>
          <li>{t.cws_when_li3}</li>
        </ul>
        <p>{t.cws_when_conclusion}</p>

        <h2>{t.cws_cta_title}</h2>
        <p>{t.cws_cta_body}</p>
        <div className="not-prose my-8">
          <Link
            href="/"
            className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {t.cws_cta_btn}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> {t.cws_disclaimer}
        </p>
      </div>
    </Layout>
  );
}
