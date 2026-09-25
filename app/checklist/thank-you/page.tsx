"use client";

import { Suspense } from "react";
import { MetaPixel } from "@/components/MetaPixel";
import { ChecklistThankYouOffer } from "@/components/ChecklistThankYouOffer";
import { useOffer } from "@/lib/useOffer";

// Same pixel ID as before this page's content changed — the ID and the URL
// (/checklist/thank-you) are what Meta ties ad tracking/attribution to, not
// the page's content, so swapping what renders here doesn't affect it. This
// still fires a base PageView on load exactly as it did before; there was
// never a custom "Lead" or other event on this page to preserve beyond that.
const FB_PIXEL_ID = "1749227409631509";

function ThankYouOfferContent() {
  const offer = useOffer();

  return typeof offer === "object" ? (
    <ChecklistThankYouOffer token={offer.token} expiresAt={offer.expiresAt} />
  ) : offer === "unavailable" ? (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm px-6 text-center">
      Something went wrong loading this offer. Please refresh, or{" "}
      <a href="/auth/login" className="underline">sign in</a> if you already have an account.
    </div>
  ) : null;
}

export default function ChecklistThankYouPage() {
  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      <Suspense fallback={null}>
        <ThankYouOfferContent />
      </Suspense>
    </>
  );
}
