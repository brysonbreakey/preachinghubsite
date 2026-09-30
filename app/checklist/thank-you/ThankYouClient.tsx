"use client";

import { MetaPixel } from "@/components/MetaPixel";
import { ChecklistThankYouTrial } from "@/components/ChecklistThankYouTrial";

// Same pixel ID as before this page's content changed — the ID and the URL
// (/checklist/thank-you) are what Meta ties ad tracking/attribution to, not
// the page's content, so swapping what renders here doesn't affect it. This
// still fires a base PageView on load exactly as it did before; there was
// never a custom "Lead" or other event on this page to preserve beyond that.
const FB_PIXEL_ID = "1749227409631509";

export default function ChecklistThankYouPage() {
  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      <ChecklistThankYouTrial />
    </>
  );
}
