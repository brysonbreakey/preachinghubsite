import { createHmac } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const addContact = vi.fn();
vi.mock("@/lib/kit", () => ({ addSevenDayChallengeContact: (...a: unknown[]) => addContact(...a) }));
vi.mock("@/lib/challengeToken", () => ({
  createChallengeLink: () => "https://app.preachinghub.com/api/challenge/start?t=x",
  createChallengePaymentAlert: () => "alert-token",
}));
const fetchMock = vi.fn(async () => new Response("{}"));
vi.stubGlobal("fetch", fetchMock);
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }) }),
}));

import { POST } from "./route";

const SECRET = "whsec_test";
function req(body: object, opts: { sign?: boolean } = {}) {
  const raw = JSON.stringify(body);
  const t = Math.floor(Date.now() / 1000);
  const sig = opts.sign === false ? "t=1,v1=bad" : `t=${t},v1=${createHmac("sha256", SECRET).update(`${t}.${raw}`).digest("hex")}`;
  return new Request("https://x.test/api/stripe/webhook", { method: "POST", body: raw, headers: { "stripe-signature": sig } }) as never;
}
const paid = (over: object = {}) => ({
  type: "checkout.session.completed",
  data: { object: { payment_status: "paid", customer_details: { email: "a@b.co" }, metadata: { challenge_start: "2026-11-17", first_name: "Ann", last_name: "Lee", phone: "555-123-4567" }, ...over } },
});

describe("stripe webhook", () => {
  beforeEach(() => { addContact.mockReset(); fetchMock.mockClear(); process.env.STRIPE_WEBHOOK_SECRET = SECRET; });

  it("rejects a bad signature and does nothing", async () => {
    expect((await POST(req(paid(), { sign: false }))).status).toBe(400);
    expect(addContact).not.toHaveBeenCalled();
  });
  it("lets a paid cohort-2 payment in: tag, fields and link", async () => {
    const res = await POST(req(paid()));
    expect(res.status).toBe(200);
    expect(addContact).toHaveBeenCalledWith({ email: "a@b.co", firstName: "Ann", lastName: "Lee", phone: "555-123-4567", challengeLink: expect.stringContaining("challenge/start") });
  });
  it("alerts the app the moment a payment goes through, and a failed alert never blocks the member", async () => {
    await POST(req(paid()));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toMatch(/\/api\/challenge\/payment-alert$/);
    expect(JSON.parse(init.body)).toEqual({ token: "alert-token" });
    fetchMock.mockRejectedValueOnce(new Error("app down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(req(paid()));
    spy.mockRestore();
    expect(res.status).toBe(200);
    expect(addContact).toHaveBeenCalledTimes(2);
  });
  it("ignores unpaid sessions, other cohorts, other events", async () => {
    await POST(req(paid({ payment_status: "unpaid" })));
    await POST(req(paid({ metadata: { challenge_start: "2026-11-10" } })));
    await POST(req({ type: "charge.succeeded", data: { object: {} } }));
    expect(addContact).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled(); // no alert for anything that isn't a paid cohort-2 payment
  });
  it("answers 500 when Kit fails so Stripe retries", async () => {
    addContact.mockRejectedValueOnce(new Error("kit down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await POST(req(paid()))).status).toBe(500);
    spy.mockRestore();
  });
});
