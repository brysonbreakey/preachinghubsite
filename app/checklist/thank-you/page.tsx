import ChecklistThankYouPage from "./ThankYouClient";

// No longer has a countdown or signed token (that's the $1-offer version,
// swapped out for a straight-to-trial page), but keeping force-dynamic
// anyway — Vercel's edge previously served a stale cached copy of this exact
// route to real visitors for 20+ minutes after a content swap (confirmed via
// a real PostHog recording), and this route has changed content enough times
// this way that it's not worth re-risking for the marginal caching benefit.
export const dynamic = "force-dynamic";

export default ChecklistThankYouPage;
