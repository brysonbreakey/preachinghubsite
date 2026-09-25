"use client";

import { useEffect, useState } from "react";
import { MetaPixel } from "@/components/MetaPixel";
import { ChecklistThankYouOffer } from "@/components/ChecklistThankYouOffer";

const FB_PIXEL_ID = "1749227409631509";
const OFFER_STORAGE_KEY = "ph_checklist_offer";

// Preview-only route for the $1-first-month replacement of /checklist/thank-you.
// Not linked from anywhere and not where ad traffic points — this is where to
// look at and test the new page before /checklist/thank-you is swapped over to
// it. Once that swap happens, this route (and the hook below) should move
// there and this file should be deleted.
function useOffer(): "loading" | "unavailable" | { token: string; expiresAt: number } {
  const [state, setState] = useState<"loading" | "unavailable" | { token: string; expiresAt: number }>("loading");
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(OFFER_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { token: string; expiresAt: number };
          if (saved?.token && saved.expiresAt > Date.now()) {
            if (!cancelled) setState(saved);
            return;
          }
        }
      } catch {
        // fall through and request a fresh one
      }
      try {
        const res = await fetch("/api/offer-token", { method: "POST" });
        if (!res.ok) throw new Error("offer_token_failed");
        const data = (await res.json()) as { token: string; expiresAt: number };
        try {
          localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(data));
        } catch {}
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) setState("unavailable");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

export default function OfferPreviewPage() {
  const offer = useOffer();

  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      {typeof offer === "object" ? (
        <ChecklistThankYouOffer token={offer.token} expiresAt={offer.expiresAt} />
      ) : offer === "unavailable" ? (
        <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm px-6 text-center">
          Offer unavailable — check OFFER_SIGNING_SECRET is set in this environment.
        </div>
      ) : null}
    </>
  );
}
