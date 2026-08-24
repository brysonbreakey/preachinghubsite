import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — PreachingHub",
  description: "The terms that govern your access to and use of PreachingHub.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed mb-4">{children}</ul>;
}

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-400 mb-10">Effective Date: August 22, 2026</p>

          <P>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of PreachingHub, a sermon preparation and AI coaching platform (the &ldquo;Service&rdquo;), operated by PreachingHub, LLC, a Tennessee single-member limited liability company (&ldquo;PreachingHub,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account, accessing, or using the Service, you (&ldquo;you&rdquo; or &ldquo;User&rdquo;) agree to be bound by these Terms. If you do not agree, do not use the Service.
          </P>
          <P>
            If you are using the Service on behalf of a church, ministry, or other organization, you represent that you have authority to bind that organization to these Terms, and &ldquo;you&rdquo; includes both you individually and that organization.
          </P>

          <H2>1. The Service</H2>
          <P>
            PreachingHub provides sermon preparation tools and AI-generated coaching, evaluation, and feedback on sermon content that you create. The Service is a coaching and evaluation tool. It is designed to help you refine and strengthen sermons you have written or preached &mdash; it does not, and will not, generate sermon outlines, illustrations, application points, or sermon drafts on your behalf. Any AI feedback you receive is intended as coaching input, not as a substitute for your own study, judgment, discernment, or theological conviction.
          </P>
          <P>
            We may add, modify, or discontinue features of the Service at any time, including features described in our marketing materials, provided such changes do not materially reduce the core functionality of a paid subscription without notice.
          </P>

          <H2>2. Accounts</H2>
          <UL>
            <li>You must provide accurate registration information and keep it up to date.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</li>
            <li>You must notify us promptly of any unauthorized use of your account.</li>
            <li>You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </UL>

          <H2>3. Your Content</H2>

          <p className="text-base font-bold text-slate-900 mt-6 mb-2">3.1 Ownership</p>
          <P>
            You retain full ownership of all sermons, outlines, notes, audio, video, and other material you upload, write, or record within the Service (&ldquo;Your Content&rdquo;). We do not claim any ownership interest in Your Content.
          </P>

          <p className="text-base font-bold text-slate-900 mt-6 mb-2">3.2 License to Us</p>
          <P>
            By submitting Your Content to the Service, you grant PreachingHub a limited, non-exclusive, worldwide license to host, store, process, and analyze Your Content solely for the purposes of: (a) operating and providing the Service to you, (b) generating the AI coaching and evaluation features you request, and (c) improving and maintaining the Service&apos;s technical performance. This license ends when you delete Your Content or close your account, except where retention is required for legal, backup, or dispute-resolution purposes as described in our Privacy Policy.
          </P>

          <p className="text-base font-bold text-slate-900 mt-6 mb-2">3.3 Responsibility for Your Content</p>
          <P>
            You are solely responsible for Your Content and for ensuring you have the rights to any material you upload, including quoted texts, illustrations, images, or third-party copyrighted material referenced in your sermons. You represent that Your Content does not infringe the rights of any third party.
          </P>

          <p className="text-base font-bold text-slate-900 mt-6 mb-2">3.4 AI-Generated Feedback</p>
          <P>
            Coaching reports, scores, and feedback generated by the Service are produced using artificial intelligence and reflect automated analysis of Your Content. They are provided for your own developmental and coaching purposes, are not guaranteed to be accurate, complete, or theologically sound in every respect, and should not be treated as a substitute for pastoral mentorship, denominational review, or your own judgment.
          </P>

          <H2>4. Subscriptions, Billing, and Cancellation</H2>
          <UL>
            <li>Paid subscription plans are billed in advance on a recurring basis (monthly or annually, as selected at signup) until canceled.</li>
            <li>You may cancel your subscription at any time through your account settings or by contacting us. Cancellation takes effect at the end of your current billing period.</li>
            <li>All fees are non-refundable, including partial-month or partial-year periods, except where required by applicable law.</li>
            <li>We may change subscription pricing with at least 30 days&apos; notice before the change applies to your next billing cycle. Continued use of the Service after a price change takes effect constitutes acceptance of the new pricing.</li>
            <li>If a payment fails, we may suspend access to paid features until payment is resolved.</li>
            <li>Certain discounted, promotional, grant-funded, or lifetime-access offers may carry additional or different terms disclosed at the time of the offer; those specific terms control in the event of a conflict with this Section 4.</li>
          </UL>

          <H2>5. Acceptable Use</H2>
          <P>You agree not to:</P>
          <UL>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation.</li>
            <li>Upload content that is defamatory, harassing, hateful, or that infringes the intellectual property or privacy rights of others.</li>
            <li>Attempt to reverse-engineer, decompile, scrape, or extract the underlying software, models, or coaching methodology of the Service.</li>
            <li>Share your account credentials with, or provide access to, individuals not authorized under your subscription plan.</li>
            <li>Use the Service to build or train a competing product.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service, including through automated means.</li>
          </UL>

          <H2>6. Third-Party Services and Methodology</H2>
          <P>
            The Service may incorporate or reference third-party content, translations, or methodology under license, including licensed Bible translation text and preaching methodology frameworks. Such material remains the property of its respective owners and is provided to you subject to the applicable license restrictions, which may include limits on redistribution, caching, or text-to-speech use. We are not responsible for the accuracy or availability of third-party content beyond our reasonable control.
          </P>

          <H2>7. Intellectual Property</H2>
          <P>
            Except for Your Content, the Service &mdash; including its software, design, coaching methodology implementation, evaluation frameworks, trademarks, and all associated intellectual property &mdash; is owned by PreachingHub or its licensors and is protected by applicable intellectual property laws. Nothing in these Terms grants you any right to use PreachingHub&apos;s name, branding, or trademarks without our prior written consent.
          </P>

          <H2>8. Disclaimers</H2>
          <P>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY. We do not warrant that the Service will be uninterrupted, error-free, or that AI-generated feedback will be accurate, complete, or suitable for any particular preaching context or tradition. You are solely responsible for exercising your own theological and pastoral judgment regarding any feedback provided.
          </P>

          <H2>9. Limitation of Liability</H2>
          <P>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PREACHINGHUB AND ITS OWNER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. IN NO EVENT SHALL PREACHINGHUB&apos;S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO PREACHINGHUB IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
          </P>
          <P>
            Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.
          </P>

          <H2>10. Indemnification</H2>
          <P>
            You agree to indemnify and hold harmless PreachingHub, its owner, and its affiliates from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising from your violation of these Terms, Your Content, or your use of the Service.
          </P>

          <H2>11. Termination</H2>
          <P>
            We may suspend or terminate your access to the Service, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, the Service, or third parties. You may terminate your account at any time. Upon termination, your right to use the Service ceases immediately; Sections 3.1, 7, 8, 9, 10, and 13 survive termination.
          </P>

          <H2>12. Changes to These Terms</H2>
          <P>
            We may update these Terms from time to time. If we make material changes, we will provide notice through the Service or by email prior to the change taking effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
          </P>

          <H2>13. Governing Law and Disputes</H2>
          <P>
            These Terms are governed by the laws of the State of Tennessee, without regard to its conflict-of-laws principles. Any dispute arising from these Terms or the Service shall first be addressed through good-faith informal discussion between the parties. If unresolved within 30 days, the dispute shall be subject to the exclusive jurisdiction of the state and federal courts located in Tennessee, and each party consents to personal jurisdiction there.
          </P>

          <H2>14. General Provisions</H2>
          <UL>
            <li><span className="font-semibold text-slate-900">Entire Agreement:</span> These Terms, together with our Privacy Policy, constitute the entire agreement between you and PreachingHub regarding the Service.</li>
            <li><span className="font-semibold text-slate-900">Severability:</span> If any provision of these Terms is found unenforceable, the remaining provisions remain in full force and effect.</li>
            <li><span className="font-semibold text-slate-900">No Waiver:</span> Our failure to enforce any provision of these Terms is not a waiver of our right to do so later.</li>
            <li><span className="font-semibold text-slate-900">Assignment:</span> You may not assign these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.</li>
            <li><span className="font-semibold text-slate-900">Contact:</span> Questions about these Terms may be directed to <a href="mailto:bryson@preachinghub.com" className="font-semibold" style={{ color: "#3760ad" }}>bryson@preachinghub.com</a>.</li>
          </UL>
        </div>
      </section>
      <Footer />
    </main>
  );
}
