"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ROLLING_STORAGE_KEY = "ph_checklist_offer";
const FIXED_STORAGE_KEY = "ph_fixed_offer";

export type OfferState = "loading" | "unavailable" | { token: string; expiresAt: number };

// A token is "<expiresAt>.<hmac signature>" (see lib/offerToken.ts). The
// expiresAt is only read here for display — the real check happens
// server-side when the token is actually used, so a malformed/tampered
// token just fails to parse and falls through to the next source below.
function parseToken(token: string): { token: string; expiresAt: number } | null {
  const expiresAt = Number(token.split(".")[0]);
  if (!Number.isFinite(expiresAt)) return null;
  return { token, expiresAt };
}

// Resolves the offer in priority order:
//   1. ?offer= in the URL — set by checklist-signup at the moment they
//      submitted the form, so a later email linking back here (any device,
//      any browser) shows the exact same deadline, not a fresh 24 hours.
//   2. localStorage — the same browser revisiting without that link.
//   3. Mint one — only for landing on this page with neither (e.g. testing
//      it directly). For "rolling" this starts a fresh 24 hours from now;
//      for "fixed" it's the same server-side campaign deadline every time,
//      so there's nothing visitor-specific to protect and the ?offer= param
//      is mostly unused on those pages, but still honored if present.
// An already-expired ?offer= link is passed through as-is rather than
// falling back — ChecklistThankYouOffer already renders the "ended" state
// correctly for a past expiresAt, which is the honest result for a stale link.
export function useOffer(deadline: "rolling" | "fixed" = "rolling"): OfferState {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("offer");
  const [state, setState] = useState<OfferState>("loading");
  const storageKey = deadline === "fixed" ? FIXED_STORAGE_KEY : ROLLING_STORAGE_KEY;

  useEffect(() => {
    let cancelled = false;

    if (urlToken) {
      const parsed = parseToken(urlToken);
      if (parsed) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(parsed));
        } catch {}
        setState(parsed);
        return;
      }
      // Malformed — fall through to localStorage/fresh mint below.
    }

    (async () => {
      try {
        const raw = localStorage.getItem(storageKey);
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
        const res = await fetch("/api/offer-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deadline }),
        });
        if (!res.ok) throw new Error("offer_token_failed");
        const data = (await res.json()) as { token: string; expiresAt: number };
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch {}
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) setState("unavailable");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [urlToken, deadline, storageKey]);

  return state;
}
