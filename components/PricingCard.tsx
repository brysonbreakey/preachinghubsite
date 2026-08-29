"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SIGNUP_URL } from "@/lib/urls";
import { FEATURES } from "@/lib/planFeatures";

const NAVY = "#3760ad";

export function PricingCard() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const price = billing === "annual" ? 39 : 49;

  return (
    <section className="pb-24 px-6 bg-white">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8" data-animate="fade-up">
          <div className="inline-flex items-center bg-slate-100 rounded-full p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 rounded-full transition-colors ${billing === "annual" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Annual <span className="text-emerald-600">Save 20%</span>
            </button>
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full transition-colors ${billing === "monthly" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div
          className="relative rounded-2xl border-2 shadow-xl shadow-blue-100/50 p-8 flex flex-col"
          style={{ borderColor: NAVY }}
          data-animate="fade-up"
          data-delay="100"
        >
          <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Pro</h3>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-slate-900">${price}</span>
            <span className="text-slate-500 mb-1">/month</span>
          </div>
          <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
            {billing === "annual" ? "Billed annually at $468/year." : "Billed monthly. Switch to annual any time to save 20%."}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">What&apos;s included &mdash; everything, one plan</p>
          <ul className="space-y-3 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                <span className="mt-0.5 shrink-0">
                  <Icon d="M20 6 9 17l-5-5" size={15} color="#16a34a" strokeWidth={2.5} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={SIGNUP_URL}
            className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
            style={{ backgroundColor: NAVY }}
          >
            Start Your Free Trial
          </a>
          <p className="text-xs text-slate-400 text-center mt-3">14-day free trial. Card required &mdash; you won&apos;t be charged until your trial ends. Cancel anytime before then.</p>
        </div>

        <p className="text-center text-slate-500 mt-12">
          Want a plan for your whole team? <a href="mailto:bryson@preachinghub.com" className="font-semibold" style={{ color: NAVY }}>Contact us</a> to build a team account.
        </p>
      </div>
    </section>
  );
}
