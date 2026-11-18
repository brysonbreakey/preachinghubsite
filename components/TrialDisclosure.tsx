// The standard trial's terms, shown directly under every "try it free" button. The card
// requirement is deliberately in plain sight, not fine print.
export const TRIAL_CTA_LABEL = "Try PreachingHub Free for 14 Days";
export const TRIAL_DISCLOSURE = "Credit card required · $0 today · $49/month after 14 days · Cancel anytime";

export function TrialDisclosure({ className = "" }: { className?: string }) {
  return <p className={className}>{TRIAL_DISCLOSURE}</p>;
}
