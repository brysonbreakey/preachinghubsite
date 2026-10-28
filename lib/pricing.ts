// The one plan, priced two ways. Shown on /pricing and in the home page's pricing teaser.
export type Billing = "monthly" | "annual";

export const PLAN_PRICING: Record<Billing, { perMonth: number; billedLabel: string; fineprint: string }> = {
  monthly: { perMonth: 49, billedLabel: "billed monthly", fineprint: "Billed monthly. Cancel anytime." },
  annual: { perMonth: 39, billedLabel: "billed annually", fineprint: "Billed annually at $468/year. Cancel anytime." },
};
