import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — PreachingHub",
  description: "Your AI sermon coach. Less than one review from a live coach. Start your 14-day free trial.",
};

function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 bg-white text-center">
      <div className="max-w-2xl mx-auto" data-animate="fade-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
          Your AI Sermon Coach.
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-5 tracking-tight">
          Less than one review from a live coach.
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed">
          A live preaching coach charges up to $500 for a single session. Get unlimited AI coaching on your content, voice, and delivery for a fraction of the cost &mdash; for every sermon, every week.
        </p>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PricingCard />
      <Footer />
    </main>
  );
}
