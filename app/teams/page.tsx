import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { TeamPricingCalculator } from "@/components/TeamPricingCalculator";
import { FEATURES } from "@/lib/planFeatures";

export const metadata: Metadata = {
  title: "PreachingHub for Teams — Shared Billing, Volume Discounts",
  description: "Add every preacher on your staff to one team account, share the bill, and save up to 25% with volume pricing that gets better as your team grows.",
};

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative pt-32 pb-20 px-6 overflow-hidden text-center"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2c4a9e 45%, #3760ad 100%)" }}
    >
      {/* Decorative glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{ backgroundColor: "#3760ad" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />

      <div className="relative max-w-3xl mx-auto" data-animate="fade-up">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] inline-block"></span>
          Save up to 25% with Team Billing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
          Take your team&apos;s preaching to new levels.
        </h1>
        <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Assign sermons, share a preaching calendar, and collaborate. Every preacher keeps their own full PreachingHub account — their own coaching, their own sermon library — while you get one consolidated bill and a discount that gets bigger the more of your staff you bring on.
        </p>
        <div className="flex items-center justify-center mb-4">
          <a href="#calculator" className="cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0b1230] font-bold px-7 py-4 rounded-xl text-base shadow-lg bg-white hover:bg-blue-50">
            See your team&apos;s price
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#0b1230" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Why team billing ───────────────────────────────────────────────────────

function WhyTeamBilling() {
  const features = [
    {
      icon: ["M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M16 2v4", "M8 2v4", "M3 10h18"],
      label: "Shared Preaching Calendar",
      title: "Know what's coming, and when",
      body: "Assign sermons to your team and keep track of everyone's preaching schedule in one shared calendar.",
      accent: "#3760ad", bg: "#eff6ff",
    },
    {
      icon: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
      label: "Collaborative Prep",
      title: "Feedback from the people who know you best",
      body: "Choose to share your notes and progress with your teammates so they can give you feedback before Sunday.",
      accent: "#0ea5e9", bg: "#f0f9ff",
    },
    {
      icon: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
      label: "One Bill",
      title: "Stop tracking down separate charges",
      body: "No more five different subscriptions hitting the church card on five different days. Team billing means one invoice and one thing to budget for.",
      accent: "#8b5cf6", bg: "#f5f3ff",
    },
    {
      icon: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
      label: "One Plan for Everyone",
      title: "No tiers to manage",
      body: "Every teammate gets the full PreachingHub experience — the same sermon builder, AI coaching, and delivery analysis. You just add seats as your staff grows.",
      accent: "#10b981", bg: "#f0fdf4",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Why churches choose a team plan.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            The same coaching your staff already relies on — just billed the way a staff actually should be.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={f.label} className="feature-card bg-white rounded-2xl border border-slate-200 p-7" data-animate="fade-up" data-delay={String(i * 100)}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: f.bg, border: `1px solid ${f.accent}25` }}>
                <Icon d={f.icon} size={20} color={f.accent} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: f.accent }}>{f.label}</p>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Plan features ──────────────────────────────────────────────────────────

function TierFeatures() {
  return (
    <section className="pt-24 pb-8 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            One plan. Every seat.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No tiers to assign or manage &mdash; every teammate you add gets the full PreachingHub experience.
          </p>
        </div>
        <div
          className="rounded-2xl border-2 shadow-xl shadow-blue-100/50 p-8"
          style={{ borderColor: "#3760ad" }}
          data-animate="fade-up"
          data-delay="100"
        >
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                <span className="mt-0.5 shrink-0">
                  <Icon d="M20 6 9 17l-5-5" size={15} color="#16a34a" strokeWidth={2.5} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing calculator ─────────────────────────────────────────────────────

function PricingCalculatorSection() {
  return (
    <section id="calculator" className="pt-8 pb-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            See exactly how much you&apos;d save
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Add seats and watch your discount update live.
          </p>
        </div>
        <div data-animate="fade-up" data-delay="100">
          <TeamPricingCalculator />
        </div>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhyTeamBilling />
      <TierFeatures />
      <PricingCalculatorSection />
      <Footer />
    </main>
  );
}
