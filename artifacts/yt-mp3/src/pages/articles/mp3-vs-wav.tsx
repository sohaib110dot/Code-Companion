import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Mp3VsWav() {
  const { lang, t: globalT } = useI18n();
  const t = getPageTranslations(lang);
  const getTranslation = (key: any) => {
    const value = t[key];
    return (!value || value === key) ? (globalT(key as any) || key) : value;
  };

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

        <h2>{t.mvw_mp3_title}</h2>
        <p>{t.mvw_mp3_body}</p>

        <h2>{t.mvw_wav_title}</h2>
        <p>{t.mvw_wav_body}</p>

        <h2>{t.mvw_diff_title}</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-4 py-3 font-semibold border border-border">Feature</th>
                <th className="text-left px-4 py-3 font-semibold border border-border">MP3</th>
                <th className="text-left px-4 py-3 font-semibold border border-border">WAV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 border border-border">{t.mvw_size_label}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_size_mp3}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_size_wav}</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="px-4 py-3 border border-border">{t.mvw_quality_label}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_quality_mp3}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_quality_wav}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-border">Compatibility</td>
                <td className="px-4 py-3 border border-border">{t.mvw_compat_mp3}</td>
                <td className="px-4 py-3 border border-border">{t.mvw_compat_wav}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t.mvw_choose_title}</h2>
        <ul>
          <li><strong>MP3:</strong> {t.mvw_choose_mp3}</li>
          <li><strong>WAV:</strong> {t.mvw_choose_wav}</li>
        </ul>

        <h2>{t.mvw_cta_title}</h2>
        <p>{t.mvw_cta_body}</p>
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
