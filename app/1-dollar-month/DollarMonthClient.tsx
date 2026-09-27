"use client";

import { Suspense } from "react";
import { ChecklistThankYouOffer } from "@/components/ChecklistThankYouOffer";
import { useOffer } from "@/lib/useOffer";

// Standalone version of the $1-offer page for sending people to directly —
// no checklist involved, so no MetaPixel here either (only the checklist
// funnel's ads need that tracked). Fixed deadline (Sept 30, 11:59 PM CDT),
// not a rolling 24 hours — this is a for-new-visitors page; existing
// accounts should go to /returning-1-dollar-month instead, though the form
// still quietly falls back to signing them in if they land here anyway.
function DollarMonthContent() {
  const offer = useOffer("fixed");

  return typeof offer === "object" ? (
    <ChecklistThankYouOffer token={offer.token} expiresAt={offer.expiresAt} variant="new" />
  ) : offer === "unavailable" ? (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm px-6 text-center">
      Something went wrong loading this offer. Please refresh, or{" "}
      <a href="/auth/login" className="underline">sign in</a> if you already have an account.
    </div>
  ) : null;
}

export default function DollarMonthPage() {
  return (
    <Suspense fallback={null}>
      <DollarMonthContent />
    </Suspense>
  );
}
