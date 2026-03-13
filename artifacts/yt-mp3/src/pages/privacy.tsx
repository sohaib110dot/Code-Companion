import React, { useEffect } from "react";
import { Layout } from "@/components/layout";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - FastYT Converter";
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <p>
          At FastYT, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FastYT and how we use it.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We deliberately minimize the amount of data we collect. We do <strong>not</strong> require user registration.
        </p>
        <ul>
          <li><strong>Log Files:</strong> Like many standard websites, we use log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</li>
          <li><strong>Cookies:</strong> We use cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h3>3. File Processing</h3>
        <p>
          When you use our service to convert a video, the processing occurs on our cloud servers. 
          <strong>We do not keep permanent copies of your converted files.</strong> Files are cached temporarily for download purposes and are automatically purged from our servers shortly after the conversion is complete.
        </p>

        <h3>4. Third-Party Advertisers</h3>
        <p>
          Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on FastYT, which are sent directly to users' browser. They automatically receive your IP address when this occurs.
        </p>

        <h3>5. Consent</h3>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </Layout>
  );
}
