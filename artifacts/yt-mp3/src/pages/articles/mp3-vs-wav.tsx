import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Mp3VsWav() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.mvw_title} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.mvw_lead.slice(0, 160));
    setMeta("keywords", "mp3 vs wav, audio formats, lossy vs lossless, compression, audio quality");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/mp3-vs-wav");
    
    // JSON-LD Article Schema
    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t.mvw_title,
        "description": t.mvw_lead,
        "url": "https://fastaudio.cc/mp3-vs-wav",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "mp3 vs wav, audio formats, lossy vs lossless"
      });
      document.head.appendChild(articleScript);
    }
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.mvw_title}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.mvw_lead}</p>

        <h2>{t.mvw_what_mp3_title}</h2>
        <p>{t.mvw_what_mp3_p1}</p>
        <p>{t.mvw_what_mp3_p2}</p>

        <h2>{t.mvw_what_wav_title}</h2>
        <p>{t.mvw_what_wav_p1}</p>
        <p>{t.mvw_what_wav_p2}</p>

        <h2>{t.mvw_differences_title}</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-4 py-3 font-semibold border border-border">{t.mvw_table_feature}</th>
                <th className="text-left px-4 py-3 font-semibold border border-border">MP3</th>
                <th className="text-left px-4 py-3 font-semibold border border-border">WAV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 border border-border">{t.mvw_table_compression}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_mp3_compression}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_wav_compression}</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="px-4 py-3 border border-border">{t.mvw_table_filesize}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_mp3_filesize}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_wav_filesize}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-border">{t.mvw_table_quality}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_mp3_quality}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_wav_quality}</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="px-4 py-3 border border-border">{t.mvw_table_bestfor}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_mp3_bestfor}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_wav_bestfor}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-border">{t.mvw_table_compatibility}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_mp3_compatibility}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_table_wav_compatibility}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t.mvw_when_mp3_title}</h2>
        <ul>
          <li>{t.mvw_when_mp3_1}</li>
          <li>{t.mvw_when_mp3_2}</li>
          <li>{t.mvw_when_mp3_3}</li>
          <li>{t.mvw_when_mp3_4}</li>
        </ul>

        <h2>{t.mvw_when_wav_title}</h2>
        <ul>
          <li>{t.mvw_when_wav_1}</li>
          <li>{t.mvw_when_wav_2}</li>
          <li>{t.mvw_when_wav_3}</li>
        </ul>

        <h2>{t.mvw_recommendation_title}</h2>
        <p>{t.mvw_recommendation_body}</p>

        <h2>{t.mvw_cta_title}</h2>
        <div className="not-prose my-8">
          <Link
            href="/"
            className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {t.mvw_cta_btn}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> {t.mvw_disclaimer}
        </p>
      </div>
    </Layout>
  );
}
