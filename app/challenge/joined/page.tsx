import type { Metadata } from "next";
import Link from "next/link";
import { CHALLENGE_PASS_END_LABEL, CHALLENGE_START_DATE_LABEL } from "@/lib/challenge";
import { createChallengeClaim } from "@/lib/challengeToken";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { ChallengeAccountStep } from "@/components/challenge/ChallengeAccountStep";

export const metadata: Metadata = {
  title: { absolute: "You're in | PreachingHub 7-Day Preaching Growth Challenge" },
  robots: { index: false },
};
export const dynamic = "force-dynamic";

// Where Stripe sends people after they pay the $7. This page asks Stripe whether the payment went
// through (the session id in the URL), and only then shows the account step: pick a password, get
// an account with the challenge pass, go to the homework. The tag, fields and the welcome email
// come from the Stripe webhook (app/api/stripe/webhook), not from this page. If the payment can't
// be confirmed here, the page just says to check the email; the webhook still lets them in.
export default async function Page({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const session = session_id ? await retrieveCheckoutSession(session_id) : null;
  const email = (session?.customer_details?.email || session?.customer_email || "").trim();
  const confirmed = session?.payment_status === "paid" && session.metadata?.challenge_start === CHALLENGE_START_DATE_LABEL && !!email;
  const firstName = session?.metadata?.first_name ?? "";
  const claim = confirmed ? createChallengeClaim({ email, firstName, lastName: session?.metadata?.last_name ?? "" }) : null;

  return (
    <main className="min-h-screen bg-white font-sans text-[#0F172A] antialiased">
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="mb-4 text-5xl">🎉</p>
        {claim ? (
          <>
            <p className="mb-6 text-sm font-bold uppercase tracking-widest text-emerald-600">Payment received. Thank you!</p>
            <ChallengeAccountStep claim={claim} firstName={firstName} />
            <p className="mt-8 text-xs font-medium leading-relaxed text-slate-400">
              Live kickoff: Tuesday, November 17 at 1 PM Central. Your complimentary PreachingHub access runs through {CHALLENGE_PASS_END_LABEL}. We&apos;re also emailing you your access link and what happens next.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight">You&apos;re in. Welcome to the challenge!</h1>
            <p className="mb-4 text-lg font-medium leading-relaxed text-[#64748B]">
              If your payment went through, you&apos;ll get an email within a few minutes with your PreachingHub access link and what happens next. Check your spam folder if you don&apos;t see it.
            </p>
            <p className="mb-8 text-base font-medium leading-relaxed text-[#64748B]">
              The live kickoff is Tuesday, November 17 at 1 PM Central. Your complimentary PreachingHub access runs through {CHALLENGE_PASS_END_LABEL}.
            </p>
            <Link href="/" className="inline-flex rounded-full bg-[#4F46E5] px-10 py-4 text-sm font-black uppercase tracking-widest [color:#fff]">
              Back to PreachingHub
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
