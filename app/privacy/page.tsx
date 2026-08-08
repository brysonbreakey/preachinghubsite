import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PreachingHub",
  description: "How PreachingHub collects, uses, discloses, and protects your information.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed mb-4">{children}</ul>;
}

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Updated August 2026</p>

          <P>
            This Privacy Policy explains how PreachingHub (&ldquo;PreachingHub,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and protects information when you use our website (preachinghub.com) and application (app.preachinghub.com) (together, the &ldquo;Service&rdquo;).
          </P>
          <P>
            By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Service.
          </P>

          <H2>1. Information We Collect</H2>

          <H3>1.1 Information You Provide Directly</H3>
          <UL>
            <li>Account information: name, email address, church/ministry affiliation (if provided), password (stored in hashed form).</li>
            <li>Payment information: billing name and address, and payment method details. Full card numbers are never stored on our servers — payments are processed by Stripe, and Stripe&apos;s own privacy policy governs how they handle that data.</li>
            <li>Sermon content: sermon manuscripts, outlines, notes, and other text you write or upload for coaching and evaluation.</li>
            <li>Video uploads: if you use the visual delivery evaluation feature, video files you upload of your preaching.</li>
            <li>Communications: messages you send us for support, feedback, or testimonials.</li>
          </UL>

          <H3>1.2 Information Collected Automatically</H3>
          <UL>
            <li>Usage data: pages visited, features used, evaluation history, session timestamps, device and browser type, and IP address.</li>
            <li>Cookies and similar technologies: used to keep you logged in, remember preferences, and understand how the Service is used. See Section 7.</li>
          </UL>

          <H3>1.3 Information from Third Parties</H3>
          <UL>
            <li>If your church or organization sets up a shared account on your behalf, we may receive your name and email from an account administrator.</li>
          </UL>

          <H2>2. How We Use Your Information</H2>
          <P>We use collected information to:</P>
          <UL>
            <li>Provide, operate, and maintain the Service, including sermon coaching and evaluation features.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Generate AI-assisted coaching feedback on sermon content and delivery.</li>
            <li>Track progress over time (e.g., the Preaching Fingerprint feature).</li>
            <li>Communicate with you about your account, updates, or support requests.</li>
            <li>Improve and develop the Service.</li>
            <li>Detect, prevent, and address technical issues, fraud, or abuse.</li>
            <li>Comply with legal obligations.</li>
          </UL>
          <P>
            We do not use your sermon content to write, generate, or draft sermon material for you or anyone else. Our AI coaches and evaluates content you have already written — it does not create sermon content.
          </P>

          <H2>3. How We Share Your Information</H2>
          <P>We do not sell your personal information. We share information only in the following circumstances:</P>

          <H3>3.1 Service Providers</H3>
          <P>We use trusted third-party providers to operate the Service:</P>
          <UL>
            <li>Anthropic (Claude) — processes sermon text and video-derived content to generate coaching feedback.</li>
            <li>Amazon Web Services (Rekognition) — analyzes uploaded video for delivery-related signals (e.g., pacing, expression, posture) as part of the evaluation pipeline. This analysis is used internally to generate coaching feedback and is not published or shared as raw data.</li>
            <li>Stripe — processes payments and manages billing.</li>
            <li>Supabase — hosts our application database.</li>
            <li>Vercel — hosts our web application and infrastructure.</li>
          </UL>
          <P>These providers only receive the information necessary to perform their function and are contractually restricted from using it for other purposes.</P>

          <H3>3.2 Church or Organization Accounts</H3>
          <P>
            If you&apos;re part of a church or organization&apos;s shared subscription, designated account administrators may have visibility into seat assignments and billing, but not into the content of your individual sermon evaluations unless you choose to share it.
          </P>

          <H3>3.3 Legal Requirements</H3>
          <P>
            We may disclose information if required by law, subpoena, or legal process, or to protect the rights, safety, or property of PreachingHub, our users, or others.
          </P>

          <H3>3.4 Business Transfers</H3>
          <P>
            If PreachingHub is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We&apos;ll notify you if this happens and your information becomes subject to a different privacy policy.
          </P>

          <H2>4. Data Retention</H2>
          <P>
            We retain your information for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete or anonymize your personal information immediately, except where we&apos;re required to retain it for legal, tax, or accounting purposes.
          </P>
          <P>
            Uploaded video files used for delivery evaluation are retained for 7 days and then deleted, unless you choose to keep them accessible in your account history.
          </P>

          <H2>5. Your Rights and Choices</H2>
          <P>Depending on your location, you may have the right to:</P>
          <UL>
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate information.</li>
            <li>Delete your account and associated data.</li>
            <li>Export your sermon content and evaluation history.</li>
            <li>Opt out of non-essential communications.</li>
          </UL>
          <P>To exercise these rights, contact us at <a href="mailto:bryson@preachinghub.com" className="font-semibold" style={{ color: "#3760ad" }}>bryson@preachinghub.com</a>.</P>
          <P>
            If you are located in the European Economic Area, UK, or California, you may have additional rights under GDPR or CCPA, respectively.
          </P>

          <H2>6. Data Security</H2>
          <P>
            We use industry-standard safeguards — including encryption in transit, access controls, and secure infrastructure providers — to protect your information. No system is perfectly secure, and we cannot guarantee absolute security.
          </P>

          <H2>7. Cookies</H2>
          <P>
            We use cookies and similar technologies to keep you logged in, remember your preferences, and understand aggregate usage patterns. You can control cookies through your browser settings, though disabling them may affect functionality.
          </P>

          <H2>8. Children&apos;s Privacy</H2>
          <P>
            The Service is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us information, contact us and we will delete it.
          </P>

          <H2>9. International Users</H2>
          <P>
            If you access the Service from outside the United States, your information will be transferred to and processed in the United States, where our servers and service providers operate.
          </P>

          <H2>10. Changes to This Policy</H2>
          <P>
            We may update this Privacy Policy from time to time. We&apos;ll update the &ldquo;Last Updated&rdquo; date above and, for material changes, provide additional notice (such as an email or in-app notification).
          </P>

          <H2>11. Contact Us</H2>
          <P>If you have questions about this Privacy Policy, contact us at:</P>
          <P>
            <a href="mailto:bryson@preachinghub.com" className="font-semibold" style={{ color: "#3760ad" }}>bryson@preachinghub.com</a>
          </P>
        </div>
      </section>
      <Footer />
    </main>
  );
}
