import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";
import { FaqSection } from "@/components/FaqSection";
import { PRICING_FAQ_IDS } from "@/lib/faqs";
import { GUARANTEE_LONG, GUARANTEE_SHORT, GUARANTEE_EMAIL } from "@/lib/guarantee";
import { Accent, H, INDIGO } from "@/components/FeatureBits";
import { BlackFridayOffer } from "@/components/BlackFridayOffer";

export const metadata: Metadata = {
  title: "Pricing — PreachingHub",
  description: "One plan for sermon prep, expert feedback, and delivery coaching. Try it free for 14 days. Credit card required, cancel anytime.",
};

function Hero() {
  return (
    <section className="pt-32 pb-12 px-6 bg-white text-center">
      <div className="max-w-2xl mx-auto" data-animate="fade-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
          Grow every time you preach.
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Prepare, refine, preach, and review every sermon in one place.
        </p>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="py-16 sm:py-20 px-6 bg-slate-50">
      <div className="max-w-2xl mx-auto text-center" data-animate="fade-up">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-indigo-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: INDIGO }}>{GUARANTEE_SHORT}</p>
        <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>
          Grow in 30 days, or <Accent>get your money back.</Accent>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">{GUARANTEE_LONG}</p>
        <p className="mt-3 text-sm text-slate-500">Refund requests: <a href={`mailto:${GUARANTEE_EMAIL}`} className="font-semibold hover:underline" style={{ color: INDIGO }}>{GUARANTEE_EMAIL}</a></p>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BlackFridayOffer />
      <PricingCard />
      <Guarantee />
      <FaqSection ids={PRICING_FAQ_IDS} />
      <Footer />
    </main>
  );
}
