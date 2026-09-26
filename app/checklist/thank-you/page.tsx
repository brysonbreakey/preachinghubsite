import ChecklistThankYouPage from "./ThankYouClient";

// This page shows a live, per-visitor countdown and a signed offer token —
// content that must never be served from a static cache. Vercel's edge was
// caching the prerendered static HTML from before the $1-offer swap and
// serving it to some visitors well after the new version was live (up to at
// least 22 minutes, confirmed via a real PostHog session recording), because
// a plain "use client" page with no data fetching gets statically prerendered
// by default. force-dynamic (only valid in a server component, hence this
// file split from the actual page) makes every request render fresh.
export const dynamic = "force-dynamic";

export default ChecklistThankYouPage;
