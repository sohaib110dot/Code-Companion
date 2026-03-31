import React, { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function ConvertVideoToMp3() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.cvmp3_title} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.cvmp3_lead.slice(0, 160));
    setMeta("keywords", "convert video to mp3, how to convert, online conversion, video to audio");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/convert-video-to-mp3");

    let articleScript = document.querySelector('script[data-type="article-schema"]');
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.type = "application/ld+json";
      articleScript.setAttribute("data-type", "article-schema");
      articleScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t.cvmp3_title,
        "description": t.cvmp3_lead,
        "url": "https://fastaudio.cc/convert-video-to-mp3",
        "author": {"@type": "Organization", "name": "FastAudio"},
        "datePublished": "2026-03-23",
        "keywords": "convert video to mp3, how to convert, online conversion"
      });
      document.head.appendChild(articleScript);
    }
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.cvmp3_title}</h1>

        <p className="lead text-xl text-muted-foreground mb-8">{t.cvmp3_lead}</p>

        <h2>{t.cvmp3_why_title}</h2>
        <p>{t.cvmp3_why_body}</p>

        <h2>{t.cvmp3_need_title}</h2>
        <p>{t.cvmp3_need_body}</p>
        <ul>
          <li>{t.cvmp3_need_li1}</li>
          <li>{t.cvmp3_need_li2}</li>
          <li>{t.cvmp3_need_li3}</li>
        </ul>
        <p>{t.cvmp3_need_note}</p>

        <h2>{t.cvmp3_steps_title}</h2>
        <ol>
          <li>{t.cvmp3_step1}</li>
          <li>{t.cvmp3_step2}</li>
          <li>{t.cvmp3_step3}</li>
          <li>{t.cvmp3_step4}</li>
          <li>{t.cvmp3_step5}</li>
          <li>{t.cvmp3_step6}</li>
        </ol>

        <h2>{t.cvmp3_bitrate_title}</h2>
        <p>{t.cvmp3_bitrate_body}</p>
        <ul>
          <li><strong>128 kbps</strong> — {t.cvmp3_br_128.replace("128 kbps — ", "")}</li>
          <li><strong>192 kbps</strong> — {t.cvmp3_br_192.replace("192 kbps — ", "")}</li>
          <li><strong>320 kbps</strong> — {t.cvmp3_br_320.replace("320 kbps — ", "")}</li>
        </ul>

        <h2>{t.cvmp3_tips_title}</h2>
        <p>{t.cvmp3_tips_body}</p>
        <ul>
          <li>{t.cvmp3_tip1}</li>
          <li>{t.cvmp3_tip2}</li>
          <li>{t.cvmp3_tip3}</li>
          <li>{t.cvmp3_tip4}</li>
        </ul>

        <h2>{t.cvmp3_cta_title}</h2>
        <p>{t.cvmp3_cta_body}</p>
        <div className="not-prose my-8">
          <Link href="/" className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity">
            {t.cvmp3_cta_btn}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> {t.cvmp3_disclaimer}
        </p>
      </div>
    </Layout>
  );
}
