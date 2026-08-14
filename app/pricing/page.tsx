import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { buildTierSignupUrl } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Pricing — PreachingHub",
  description: "Simple, tiered pricing for every stage of ministry. Start your 14-day free trial — no card required.",
};

const TIERS: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  tier: "core" | "pro" | "max";
  highlighted: boolean;
}[] = [
  {
    name: "Core",
    price: "$29",
    tagline: "Best for occasional preachers who want solid feedback on individual sermons.",
    features: [
      "Sermon Builder",
      "AI Feedback Reports (text, audio, video, YouTube)",
      "Sermon Briefs",
      "PDF Feedback Reports",
      "Pulpit Mode",
      "Research Library",
    ],
    tier: "core",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    tagline: "Best for regular preachers building an ongoing coaching relationship.",
    features: [
      "Everything in Core",
      "Personalized AI Coaching with memory of past sermons",
      "Ongoing focused growth areas",
      "Preaching Profile",
      "Unlimited evaluations",
    ],
    tier: "pro",
    highlighted: true,
  },
  {
    name: "Max",
    price: "$99",
    tagline: "Best for senior pastors and preachers who want the full experience.",
    features: [
      "Everything in Pro",
      "Visual Delivery Evaluation (BETA) — body language & facial expressions",
      "Preaching Fingerprint Report",
      "Quarterly Preaching Growth Report",
      "Early access to new features",
    ],
    tier: "max",
    highlighted: false,
  },
];

function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 bg-white text-center">
      <div className="max-w-2xl mx-auto" data-animate="fade-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
          A tier for every preacher&apos;s current needs.
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-5">
          Whether you preach occasionally or you&apos;re building a weekly coaching rhythm with your staff, there&apos;s a plan built for where you are. Every plan starts with a 14-day free trial &mdash; no card required.
        </p>
        <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#3760ad] text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
          No demo call. No long wait.
        </span>
      </div>
    </section>
  );
}

function PricingCards() {
  return (
    <section className="pb-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-8 flex flex-col ${
              t.highlighted ? "border-2 shadow-xl shadow-blue-100/50" : "border-slate-200"
            }`}
            style={t.highlighted ? { borderColor: "#3760ad" } : undefined}
            data-animate="fade-up"
            data-delay={String(i * 100)}
          >
            {t.highlighted && (
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-white border rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ color: "#3760ad", borderColor: "#3760ad" }}
              >
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">{t.name}</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-extrabold text-slate-900">{t.price}</span>
              <span className="text-slate-500 mb-1">/month</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 pb-6 border-b border-slate-100">{t.tagline}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 shrink-0">
                    <Icon d="M20 6 9 17l-5-5" size={15} color="#16a34a" strokeWidth={2.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={buildTierSignupUrl(t.tier)}
              className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
              style={{ backgroundColor: "#3760ad" }}
            >
              Start Your Free Trial
            </a>
            <p className="text-xs text-slate-400 text-center mt-3">No card required.</p>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-500 mt-12">
        Want a plan for your whole team? <a href="mailto:bryson@preachinghub.com" className="font-semibold" style={{ color: "#3760ad" }}>Contact us</a> to build a team account.
      </p>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PricingCards />
      <Footer />
    </main>
  );
}
