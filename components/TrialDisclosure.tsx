// The standard trial's terms, shown directly under every "try it free" button. The card
// requirement is deliberately in plain sight, not fine print.
export const TRIAL_CTA_LABEL = "Try it Free for 14 Days";
export const TRIAL_DISCLOSURE = "Credit card required · $0 today · $49/month after 14 days · Cancel anytime";

// `stacked` breaks the line in two so the text is narrower than the button above it.
export function TrialDisclosure({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  if (!stacked) return <p className={className}>{TRIAL_DISCLOSURE}</p>;
  return (
    <p className={className}>
      Credit card required · $0 today
      <br />
      $49/month after 14 days · Cancel anytime
    </p>
  );
}
