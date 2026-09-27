"use client";

import { Suspense } from "react";
import { ChecklistThankYouOffer } from "@/components/ChecklistThankYouOffer";
import { useOffer } from "@/lib/useOffer";

// For sending to past trial/customers specifically — "welcome back" copy,
// and the password field says up front it can sign them back in, unlike
// /1-dollar-month's for-new-visitors wording. No MetaPixel; same fixed
// Sept 30 deadline as /1-dollar-month, not a rolling 24 hours.
function ReturningContent() {
  const offer = useOffer("fixed");

  return typeof offer === "object" ? (
    <ChecklistThankYouOffer token={offer.token} expiresAt={offer.expiresAt} variant="returning" />
  ) : offer === "unavailable" ? (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm px-6 text-center">
      Something went wrong loading this offer. Please refresh, or{" "}
      <a href="/auth/login" className="underline">sign in</a> if you already have an account.
    </div>
  ) : null;
}

export default function ReturningPage() {
  return (
    <Suspense fallback={null}>
      <ReturningContent />
    </Suspense>
  );
}
