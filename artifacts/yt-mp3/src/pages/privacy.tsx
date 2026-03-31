import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - FastAudio Media Converter";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Read FastAudio Media Converter's privacy policy. Learn how we collect, use, and protect your data. No registration required, minimal data collection.");
    setMeta("keywords", "privacy policy, data protection, user privacy, cookies, GDPR");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://fastaudio.cc/privacy-policy");
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>

        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>
          At FastAudio Media Converter, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We deliberately minimize the data we collect. We do <strong>not</strong> require user registration, an account, or any personal information to use our Service.
        </p>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li><strong>Log Files:</strong> Like most websites, our servers automatically record standard log data including IP addresses, browser type and version, Internet Service Provider (ISP), date and time of access, referring/exit pages, and the number of clicks. This data is used solely for analyzing trends, administering the site, and improving service quality. It is not linked to any personally identifiable information.</li>
          <li><strong>Usage Data:</strong> We may collect anonymous, aggregated usage statistics (such as which features are used most frequently) to improve the Service. This data cannot be used to identify individual users.</li>
        </ul>

        <h3>Information You Provide</h3>
        <ul>
          <li><strong>URLs submitted for conversion:</strong> When you use our Service, you submit a URL for processing. We process this URL to perform the conversion but do not store it permanently or associate it with your identity.</li>
          <li><strong>Contact form submissions:</strong> If you contact us via email, we collect your email address and message content to respond to your inquiry.</li>
        </ul>

        <h2>2. File Processing and Data Retention</h2>
        <p>
          <strong>We do not permanently store any converted audio files.</strong> When you use our Service:
        </p>
        <ul>
          <li>Your submitted URL is processed on our servers to extract audio</li>
          <li>The resulting audio file is temporarily cached for immediate download (typically for less than 1 hour)</li>
          <li>All temporary files are automatically and permanently deleted from our servers after this period</li>
          <li>We do not retain, archive, or distribute any converted media files</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>
          We use cookies to enhance your experience on our website. Cookies are small data files stored on your device. You can set your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the Service to function correctly (e.g., your theme preference).</li>
          <li><strong>Analytics cookies:</strong> Used to understand how visitors interact with our website anonymously.</li>
          <li><strong>Advertising cookies:</strong> Third-party advertisers may place cookies to deliver relevant advertisements. These cookies are governed by the respective advertiser's privacy policy.</li>
        </ul>

        <h2>4. Third-Party Advertising</h2>
        <p>
          We may display advertisements served by third-party advertising networks (such as Google AdSense). These third parties may use cookies, web beacons, and similar technologies to collect information about your browsing activity across websites to serve you targeted advertisements. This information is collected directly by the advertising network and is subject to their privacy policies.
        </p>
        <p>
          You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary">Google's Ad Settings</a> or the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary">Digital Advertising Alliance opt-out page</a>.
        </p>

        <h2>5. How We Use Your Information</h2>
        <p>The limited information we collect is used to:</p>
        <ul>
          <li>Provide, operate, and maintain the Service</li>
          <li>Improve and optimize the user experience</li>
          <li>Analyze usage patterns to enhance features</li>
          <li>Detect and prevent abuse, fraud, or unauthorized use</li>
          <li>Respond to user inquiries and support requests</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>6. Data Sharing and Disclosure</h2>
        <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share information only in the following limited circumstances:</p>
        <ul>
          <li><strong>Service providers:</strong> We may engage trusted third-party companies to assist in operating our Service (e.g., hosting providers), who are contractually obligated to keep information confidential.</li>
          <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or government authority, or when we believe disclosure is necessary to protect our rights or the safety of others.</li>
        </ul>

        <h2>7. Your Rights (GDPR / CCPA)</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li><strong>Right to Access:</strong> Request a copy of any personal data we hold about you</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
          <li><strong>Right to Restriction:</strong> Request restriction of processing of your personal data</li>
          <li><strong>Right to Object:</strong> Object to our processing of your personal data</li>
          <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organization</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at <strong>sonujee@proton.me</strong>. We will respond to all legitimate requests within 30 days.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will promptly delete such information.
        </p>

        <h2>9. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We reserve the right to update this Privacy Policy at any time. We will notify users of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the updated Policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
        </p>
        <p><strong>Email:</strong> sonujee@proton.me</p>

        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-6">
          By using FastAudio Media Converter, you consent to the data practices described in this Privacy Policy.
        </p>
      </div>
    </Layout>
  );
}
