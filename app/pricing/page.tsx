import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — PreachingHub",
  description: "One plan for sermon prep, expert feedback, and delivery coaching. Try it free for 7 days, no card required.",
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
