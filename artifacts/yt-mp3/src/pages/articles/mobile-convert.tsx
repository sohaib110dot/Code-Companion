import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function MobileConvert() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.mc_title} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.mc_lead.slice(0, 160));
    setMeta("keywords", "mobile conversion, convert on phone, iphone, android, mobile converter, convert on ipad");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/mobile-convert");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t.mc_title,
        "description": t.mc_lead,
        "url": "https://fastaudio.cc/mobile-convert",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "mobile conversion, convert on phone, iphone, android"
      });
      document.head.appendChild(articleScript);
    }
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.mc_title}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.mc_lead}</p>

        <h2>{t.mc_can_title}</h2>
        <p>{t.mc_can_p1}</p>
        <p>{t.mc_can_p2}</p>

        <h2>{t.mc_iphone_title}</h2>
        <ol>
          <li>{t.mc_iphone_step1}</li>
          <li>{t.mc_iphone_step2}</li>
          <li>{t.mc_iphone_step3}</li>
          <li>{t.mc_iphone_step4}</li>
          <li>{t.mc_iphone_step5}</li>
          <li>{t.mc_iphone_step6}</li>
        </ol>

        <h2>{t.mc_android_title}</h2>
        <ol>
          <li>{t.mc_android_step1}</li>
          <li>{t.mc_android_step2}</li>
          <li>{t.mc_android_step3}</li>
          <li>{t.mc_android_step4}</li>
          <li>{t.mc_android_step5}</li>
          <li>{t.mc_android_step6}</li>
        </ol>

        <h2>{t.mc_tips_title}</h2>
        <ul>
          <li>{t.mc_tip1}</li>
          <li>{t.mc_tip2}</li>
          <li>{t.mc_tip3}</li>
          <li>{t.mc_tip4}</li>
        </ul>

        <h2>{t.mc_why_title}</h2>
        <ul>
          <li>{t.mc_why1}</li>
          <li>{t.mc_why2}</li>
          <li>{t.mc_why3}</li>
          <li>{t.mc_why4}</li>
        </ul>

        <h2>{t.mc_ready_title}</h2>
        <p>{t.mc_ready_body}</p>
        <div className="not-prose my-8">
          <Link
            href="/"
            className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {t.mc_cta_btn}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> {t.mc_disclaimer}
        </p>
      </div>
    </Layout>
  );
}
