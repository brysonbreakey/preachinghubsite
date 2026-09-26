"use client";

import { Suspense } from "react";
import { ChecklistThankYouOffer } from "@/components/ChecklistThankYouOffer";
import { useOffer } from "@/lib/useOffer";

// Standalone version of the $1-offer page for sending people to directly —
// no checklist involved, so no MetaPixel here either (only the checklist
// funnel's ads need that tracked). If someone visits with no ?offer= link,
// useOffer mints a fresh 24-hour token right here, same as it always does
// when neither a link nor a saved one exists.
function DollarMonthContent() {
  const offer = useOffer();

  return typeof offer === "object" ? (
    <ChecklistThankYouOffer token={offer.token} expiresAt={offer.expiresAt} fromChecklist={false} />
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
