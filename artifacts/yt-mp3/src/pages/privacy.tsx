import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function Privacy() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.privacy_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.privacy_intro.slice(0, 160));
    setMeta("keywords", "privacy policy, data protection, user privacy, cookies, GDPR");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/privacy-policy");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">{t.privacy_h1}</h1>

        <p className="text-muted-foreground mb-8">{t.privacy_last_updated}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>{t.privacy_intro}</p>

        <h2>{t.privacy_s1_title}</h2>
        <p>{t.privacy_s1_body}</p>

        <h3>{t.privacy_s1_auto_title}</h3>
        <ul>
          <li><strong>{t.privacy_s1_auto_li1.split(":")[0]}:</strong> {t.privacy_s1_auto_li1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s1_auto_li2.split(":")[0]}:</strong> {t.privacy_s1_auto_li2.split(":").slice(1).join(":")}</li>
        </ul>

        <h3>{t.privacy_s1_user_title}</h3>
        <ul>
          <li><strong>{t.privacy_s1_user_li1.split(":")[0]}:</strong> {t.privacy_s1_user_li1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s1_user_li2.split(":")[0]}:</strong> {t.privacy_s1_user_li2.split(":").slice(1).join(":")}</li>
        </ul>

        <h2>{t.privacy_s2_title}</h2>
        <p><strong>{t.privacy_s2_body}</strong></p>
        <ul>
          <li>{t.privacy_s2_li1}</li>
          <li>{t.privacy_s2_li2}</li>
          <li>{t.privacy_s2_li3}</li>
          <li>{t.privacy_s2_li4}</li>
        </ul>

        <h2>{t.privacy_s3_title}</h2>
        <p>{t.privacy_s3_body}</p>
        <ul>
          <li><strong>{t.privacy_s3_li1.split(":")[0]}:</strong> {t.privacy_s3_li1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s3_li2.split(":")[0]}:</strong> {t.privacy_s3_li2.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s3_li3.split(":")[0]}:</strong> {t.privacy_s3_li3.split(":").slice(1).join(":")}</li>
        </ul>

        <h2>{t.privacy_s4_title}</h2>
        <p>{t.privacy_s4_body}</p>
        <p>{t.privacy_s4_body2}</p>

        <h2>{t.privacy_s5_title}</h2>
        <p>{t.privacy_s5_intro}</p>
        <ul>
          <li>{t.privacy_s5_li1}</li>
          <li>{t.privacy_s5_li2}</li>
          <li>{t.privacy_s5_li3}</li>
          <li>{t.privacy_s5_li4}</li>
          <li>{t.privacy_s5_li5}</li>
          <li>{t.privacy_s5_li6}</li>
        </ul>

        <h2>{t.privacy_s6_title}</h2>
        <p>{t.privacy_s6_body}</p>
        <ul>
          <li><strong>{t.privacy_s6_li1.split(":")[0]}:</strong> {t.privacy_s6_li1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s6_li2.split(":")[0]}:</strong> {t.privacy_s6_li2.split(":").slice(1).join(":")}</li>
        </ul>

        <h2>{t.privacy_s7_title}</h2>
        <p>{t.privacy_s7_intro}</p>
        <ul>
          <li><strong>{t.privacy_s7_li1.split(":")[0]}:</strong> {t.privacy_s7_li1.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s7_li2.split(":")[0]}:</strong> {t.privacy_s7_li2.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s7_li3.split(":")[0]}:</strong> {t.privacy_s7_li3.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s7_li4.split(":")[0]}:</strong> {t.privacy_s7_li4.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s7_li5.split(":")[0]}:</strong> {t.privacy_s7_li5.split(":").slice(1).join(":")}</li>
          <li><strong>{t.privacy_s7_li6.split(":")[0]}:</strong> {t.privacy_s7_li6.split(":").slice(1).join(":")}</li>
        </ul>
        <p>{t.privacy_s7_body2}</p>

        <h2>{t.privacy_s8_title}</h2>
        <p>{t.privacy_s8_body}</p>

        <h2>{t.privacy_s9_title}</h2>
        <p>{t.privacy_s9_body}</p>

        <h2>{t.privacy_s10_title}</h2>
        <p>{t.privacy_s10_body}</p>

        <h2>{t.privacy_s11_title}</h2>
        <p>{t.privacy_s11_body}</p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">{t.privacy_footer_note}</p>
      </div>
    </Layout>
  );
}
