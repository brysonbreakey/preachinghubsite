"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { APP_URL } from "@/lib/urls";
import {
  TIER_PRICES,
  TIER_LABELS,
  discountPercent,
  mixedSubtotal,
  mixedMonthlyTotal,
  totalSeats,
  type SeatAllocation,
} from "@/lib/teamPricing";

const TIER_ORDER: (keyof SeatAllocation)[] = ["core", "pro", "max"];
const DISCOUNT_TIERS = [
  { min: 2, pct: 10 },
  { min: 5, pct: 15 },
  { min: 10, pct: 20 },
];

function Stepper({
  value,
  onChange,
  min = 0,
  max = 500,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#3760ad] hover:text-[#3760ad] disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-slate-500 transition-colors"
        aria-label="Decrease seats"
      >
        <Icon d="M5 12h14" size={14} strokeWidth={2.5} />
      </button>
      <span className="w-8 text-center font-bold text-slate-900 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#3760ad] hover:text-[#3760ad] disabled:opacity-30 transition-colors"
        aria-label="Increase seats"
      >
        <Icon d="M12 5v14M5 12h14" size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function TeamPricingCalculator() {
  const [allocation, setAllocation] = useState<SeatAllocation>({ core: 0, pro: 2, max: 0 });

  const seats = totalSeats(allocation);
  const pct = discountPercent(seats);
  const subtotal = mixedSubtotal(allocation);
  const total = mixedMonthlyTotal(allocation);
  const savings = subtotal - total;

  function setSeats(tier: keyof SeatAllocation, next: number) {
    setAllocation((a) => ({ ...a, [tier]: next }));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {DISCOUNT_TIERS.map((t) => {
          const active = pct === t.pct;
          return (
            <span
              key={t.min}
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                active ? "text-white border-transparent" : "text-slate-400 border-slate-200 bg-white"
              }`}
              style={active ? { backgroundColor: "#3760ad" } : undefined}
            >
              {t.min}+ seats &middot; {t.pct}% off
            </span>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {TIER_ORDER.map((tier) => (
          <div key={tier} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-slate-900 tracking-tight">{TIER_LABELS[tier]}</span>
              <span className="text-sm text-slate-500">${TIER_PRICES[tier]}/seat</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">seats</p>
            <Stepper value={allocation[tier]} onChange={(next) => setSeats(tier, next)} />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500">
            {seats} seat{seats !== 1 ? "s" : ""} total
          </span>
          {pct > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-green-50 text-green-700">
              {pct}% team discount
            </span>
          )}
        </div>

        {subtotal > 0 && (
          <div className="space-y-1.5 mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(0)}/mo</span>
            </div>
            {pct > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Team discount ({pct}%)</span>
                <span>&minus;${savings.toFixed(0)}/mo</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-end justify-between mb-6">
          <span className="font-semibold text-slate-900">Total</span>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">${total.toFixed(0)}</span>
            <span className="text-slate-500">/month</span>
          </div>
        </div>

        <a
          href={`${APP_URL}/teams/new`}
          className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors"
          style={{ backgroundColor: "#3760ad" }}
        >
          Get Started
          <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
        </a>
        {seats < 2 && (
          <p className="text-xs text-slate-400 text-center mt-3">Add at least 2 seats to unlock a team discount.</p>
        )}
      </div>
    </div>
  );
}
