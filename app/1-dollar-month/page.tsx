import DollarMonthPage from "./DollarMonthClient";

// Live countdown + a signed per-visitor token — never safe to statically
// cache (see /checklist/thank-you's commit history for why: Vercel's edge
// served a stale cached copy of that page to real visitors for 20+ minutes
// after a content swap, since a plain "use client" page with no data
// fetching gets prerendered as static by default).
export const dynamic = "force-dynamic";

export default DollarMonthPage;
