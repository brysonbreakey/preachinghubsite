"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SIGNUP_URL } from "@/lib/urls";
import { PLAN_FEATURES } from "@/lib/planFeatures";
import { FeatureList } from "@/components/FeatureList";

const NAVY = "#3760ad";

export function PricingCard() {
  const [billing, setBilling] = useState<"annual" | "monthly">("monthly");
  const price = billing === "annual" ? 468 : 29;
  const unit = billing === "annual" ? "/year" : "/month";

  const cta = (
    <>
      <a
        href={SIGNUP_URL}
        className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
        style={{ backgroundColor: NAVY }}
      >
        Start Your Free Trial
      </a>
      <p className="text-xs text-slate-400 text-center mt-3">7-day free trial. No credit card required to start.</p>
    </>
  );

  return (
    <section className="pb-24 px-6 bg-white">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8" data-animate="fade-up">
          <div className="inline-flex items-center bg-slate-100 rounded-full p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full transition-colors ${billing === "monthly" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 rounded-full transition-colors ${billing === "annual" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Annual <span className="text-emerald-600">Save 20%</span>
            </button>
          </div>
        </div>

        <div
          className="relative rounded-2xl border-2 shadow-xl shadow-blue-100/50 p-8 flex flex-col"
          style={{ borderColor: NAVY }}
          data-animate="fade-up"
          data-delay="100"
        >
          <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">PreachingHub</h3>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-slate-900">${price}</span>
            <span className="text-slate-500 mb-1">{unit}</span>
          </div>
          <div className="mb-6">
            {billing === "monthly" && (
              <p className="text-sm text-slate-500">Intro rate for your first 3 months. $49 after that.</p>
            )}
          </div>
          <div className="pb-6 mb-6 border-b border-slate-100">{cta}</div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">What&apos;s included &mdash; everything, one plan</p>
          <FeatureList features={PLAN_FEATURES} className="mb-6" />
          {cta}
        </div>
      </div>
    </section>
  );
}
