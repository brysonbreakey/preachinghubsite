"use client";

import type { Billing } from "@/lib/pricing";

export function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-full p-1 text-sm font-semibold">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`px-4 py-2 rounded-full transition-colors ${billing === "monthly" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={`px-4 py-2 rounded-full transition-colors ${billing === "annual" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
      >
        Annual <span className="text-emerald-600">Save 20%</span>
      </button>
    </div>
  );
}
