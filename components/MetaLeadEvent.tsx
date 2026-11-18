"use client";

import { useEffect } from "react";
import { fireQualifiedLead } from "@/lib/metaLead";

// Fires Meta's "Lead" conversion event on /checklist/thank-you for people who said they preach most
// weeks (see lib/metaLead.ts). Renders nothing. The base pixel (MetaPixel) loads on this page and
// keeps sending its PageView as before.
export function MetaLeadEvent() {
  useEffect(() => {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    fireQualifiedLead(window.sessionStorage, fbq as never);
  }, []);
  return null;
}
