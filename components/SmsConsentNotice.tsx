const LINK = "font-semibold underline underline-offset-2 hover:text-slate-800";

export function SmsConsentNotice({
  buttonLabel,
  messages,
  className = "",
}: {
  buttonLabel: string;
  messages: string;
  className?: string;
}) {
  return (
    <p className={`text-xs leading-relaxed text-slate-500 ${className}`}>
      By clicking &ldquo;{buttonLabel},&rdquo; you agree to receive text messages from PreachingHub at the number you
      provided, including {messages} and occasional preaching tips and offers. Consent is not a condition of purchase.
      Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. See our{" "}
      <a href="/terms#sms-terms" className={LINK}>Terms</a> and{" "}
      <a href="/privacy#sms-privacy" className={LINK}>Privacy Policy</a>.
    </p>
  );
}
