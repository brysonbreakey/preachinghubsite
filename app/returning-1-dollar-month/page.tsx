import ReturningPage from "./ReturningClient";

// Live countdown + a signed token — never safe to statically cache (see
// /checklist/thank-you's commit history: Vercel served a stale cached copy
// of that page to real visitors for 20+ minutes after a content swap).
export const dynamic = "force-dynamic";

export default ReturningPage;
