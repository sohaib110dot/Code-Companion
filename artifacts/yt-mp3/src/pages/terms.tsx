import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "FastAudio Media Converter Terms of Service. Read our rules, DMCA policy, copyright guidelines, and acceptable use policy.");
    setMeta("keywords", "terms of service, terms and conditions, legal terms, user agreement, DMCA");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/terms");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>

        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>
          Please read these Terms of Service carefully before using FastAudio Media Converter (the "Service"). By accessing or using our Service, you confirm that you have read, understood, and agree to be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using FastAudio, you accept and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must discontinue use of the Service immediately.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          FastAudio provides a web-based audio extraction utility that processes publicly accessible URLs submitted by users and converts the audio component into downloadable MP3 format. The Service is a technical tool provided "AS IS" and "AS AVAILABLE" for <strong>personal, non-commercial use only</strong>.
        </p>
        <p>
          FastAudio does not host, store, upload, or distribute any third-party video or audio content. We act solely as a technical intermediary that processes URLs provided by users. All content remains on the originating platform's servers.
        </p>

        <h2>3. User Responsibilities and Copyright Compliance</h2>
        <p>
          <strong>You are solely responsible for ensuring that your use of this Service complies with all applicable laws, regulations, and the terms of service of any third-party platform whose content you process.</strong>
        </p>
        <p>You represent and warrant that:</p>
        <ul>
          <li>You own the copyright to any content you convert, OR</li>
          <li>You have explicit, written permission from the copyright owner to reproduce and download the content, OR</li>
          <li>The content is in the public domain or licensed under a Creative Commons or equivalent open license that permits downloading and format conversion.</li>
        </ul>
        <p>
          Converting, downloading, or reproducing copyrighted content without the owner's permission is a violation of copyright law and may expose you to civil and criminal liability. FastAudio does not encourage, condone, or facilitate copyright infringement.
        </p>

        <h2>4. Prohibited Uses</h2>
        <p>You agree <strong>NOT</strong> to use the Service to:</p>
        <ul>
          <li>Download or convert copyrighted material without the express permission of the copyright holder</li>
          <li>Circumvent any digital rights management (DRM) protections or technological measures</li>
          <li>Violate the terms of service of any third-party platform or website</li>
          <li>Use the Service for commercial purposes, including selling or redistributing converted files</li>
          <li>Use automated bots, scrapers, or scripts to send bulk requests to our Service</li>
          <li>Violate any local, national, or international law or regulation</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
        </ul>

        <h2>5. DMCA Policy and Copyright Takedown Procedure</h2>
        <p>
          FastAudio respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). We respond promptly to valid copyright infringement notices.
        </p>
        <p>
          If you are a copyright owner or an authorized agent and believe that your copyrighted work has been processed through our Service without authorization, please submit a DMCA takedown notice to our designated Copyright Agent at:
        </p>
        <div className="bg-card p-4 rounded-xl border border-border not-prose">
          <p className="text-sm font-mono"><strong>Copyright Agent:</strong> FastAudio Media Converter</p>
          <p className="text-sm font-mono"><strong>Email:</strong> sonujee@proton.me</p>
          <p className="text-sm font-mono"><strong>Subject line:</strong> DMCA Takedown Request</p>
        </div>
        <p className="mt-4">Your DMCA notice must include:</p>
        <ol>
          <li>A physical or electronic signature of the copyright owner or authorized agent</li>
          <li>Identification of the copyrighted work(s) claimed to be infringed</li>
          <li>Identification of the URL(s) or specific content you claim infringes your copyright</li>
          <li>Your contact information (name, address, telephone number, email address)</li>
          <li>A statement that you have a good-faith belief that the use is not authorized by the copyright owner</li>
          <li>A statement, under penalty of perjury, that the information in the notice is accurate and you are authorized to act on behalf of the copyright owner</li>
        </ol>
        <p>
          Upon receipt of a valid DMCA notice, we will act expeditiously to block the reported URL(s) from being processed through our Service.
        </p>

        <h2>6. Safe Harbor Disclaimer</h2>
        <p>
          FastAudio operates as a passive conduit and does not exercise editorial control over the content submitted by users. We do not initiate the transmission of content, select recipients, or select or modify the content transmitted. In accordance with Section 512 of the DMCA, we claim safe harbor protection as a service provider.
        </p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, FASTAUDIO SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless FastAudio and its operators from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected to: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual property rights; or (d) any claim that your use of the Service caused damage to a third party.
        </p>

        <h2>10. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last updated" date. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws. Any dispute arising under these Terms shall be resolved by binding arbitration or in a court of competent jurisdiction.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at: <strong>sonujee@proton.me</strong>
        </p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">
          By using FastAudio Media Converter, you acknowledge that you have read these Terms of Service and agree to be bound by them.
        </p>
      </div>
    </Layout>
  );
}
