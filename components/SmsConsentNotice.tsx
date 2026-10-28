const LINK = "underline underline-offset-2 hover:text-slate-500";

export function SmsConsentNotice({
  buttonLabel,
  className = "",
}: {
  buttonLabel: string;
  className?: string;
}) {
  return (
    <p className={`text-[11px] leading-snug text-slate-400 ${className}`}>
      By tapping &ldquo;{buttonLabel},&rdquo; you agree to get texts from PreachingHub. Msg &amp; data rates may apply.
      Frequency varies. Reply STOP to opt out.{" "}
      <a href="/terms#sms-terms" className={LINK}>Terms</a> &middot;{" "}
      <a href="/privacy#sms-privacy" className={LINK}>Privacy</a>
    </p>
  );
}
