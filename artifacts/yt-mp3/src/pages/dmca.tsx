import React, { useEffect } from "react";
import { Layout } from "@/components/layout";
import { ShieldCheck, Mail, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { getPageTranslations } from "@/lib/page-translations";

export default function DMCA() {
  const { lang } = useI18n();
  const t = getPageTranslations(lang);

  useEffect(() => {
    document.title = `${t.dmca_h1} - FastAudio`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", t.dmca_intro.slice(0, 160));
    setMeta("keywords", "DMCA, copyright, takedown notice, intellectual property, copyright infringement");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/dmca");
  }, [lang, t]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <div className="not-prose flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">{t.dmca_h1}</h1>
        </div>

        <p className="text-muted-foreground mb-8">{t.dmca_last_updated}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>{t.dmca_intro}</p>

        <h2>{t.dmca_commitment_title}</h2>
        <p>{t.dmca_commitment_body}</p>

        <h2>{t.dmca_submit_title}</h2>
        <p>{t.dmca_submit_body}</p>

        <div className="not-prose bg-card p-6 rounded-2xl border border-border shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold text-foreground mb-1">Copyright Agent — FastAudio Media Converter</p>
              <p className="text-primary font-medium">sonujee@proton.me</p>
              <p className="text-muted-foreground text-sm mt-2">Subject line: <span className="font-mono bg-muted px-1 rounded">DMCA Takedown Request</span></p>
            </div>
          </div>
        </div>

        <h2>{t.dmca_required_title}</h2>
        <p>{t.dmca_required_intro}</p>
        <ol>
          <li>{t.dmca_req_li1}</li>
          <li>{t.dmca_req_li2}</li>
          <li>{t.dmca_req_li3}</li>
          <li>{t.dmca_req_li4}</li>
          <li>{t.dmca_req_li5}</li>
          <li>{t.dmca_req_li6}</li>
        </ol>

        <div className="not-prose bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">{t.dmca_warning}</p>
          </div>
        </div>

        <h2>{t.dmca_response_title}</h2>
        <p>{t.dmca_response_intro}</p>
        <ol>
          <li>{t.dmca_resp_li1}</li>
          <li>{t.dmca_resp_li2}</li>
          <li>{t.dmca_resp_li3}</li>
          <li>{t.dmca_resp_li4}</li>
        </ol>

        <h2>{t.dmca_counter_title}</h2>
        <p>{t.dmca_counter_body}</p>
        <ol>
          <li>{t.dmca_counter_li1}</li>
          <li>{t.dmca_counter_li2}</li>
          <li>{t.dmca_counter_li3}</li>
          <li>{t.dmca_counter_li4}</li>
        </ol>

        <h2>{t.dmca_repeat_title}</h2>
        <p>{t.dmca_repeat_body}</p>

        <h2>{t.dmca_user_title}</h2>
        <p>{t.dmca_user_body}</p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">{t.dmca_footer_note}</p>
      </div>
    </Layout>
  );
}
