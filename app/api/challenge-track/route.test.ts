import { createHmac } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setChallengeTrack = vi.fn(async () => {});
vi.mock("@/lib/kit", () => ({ setChallengeTrack: (...a: unknown[]) => (setChallengeTrack as (...x: unknown[]) => unknown)(...a) }));

import { POST } from "./route";

const SECRET = "test-secret";
const mk = (prefix: string, o: object) => {
  const p = Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${p}.${createHmac("sha256", SECRET).update(`${prefix}:${p}`).digest("hex")}`;
};
const claim = (over: object = {}) => mk("challengeclaim", { e: "ann@church.org", f: "Ann", l: "Lee", x: Date.now() + 3_600_000, ...over });
const post = (body: object) =>
  POST(new Request("https://x.test/api/challenge-track", { method: "POST", body: JSON.stringify(body) }) as never).then(async (r) => ({ status: r.status, body: await r.json() }));

describe("/api/challenge-track", () => {
  beforeEach(() => {
    setChallengeTrack.mockClear();
    process.env.OFFER_SIGNING_SECRET = SECRET;
  });

  it("saves the chosen track for the email in the signed claim", async () => {
    const r = await post({ claim: claim(), track: "clarity" });
    expect(r).toEqual({ status: 200, body: { ok: true } });
    expect(setChallengeTrack).toHaveBeenCalledWith({ email: "ann@church.org", firstName: "Ann", track: "clarity" });
  });
  it("accepts 'not sure yet'", async () => {
    expect((await post({ claim: claim(), track: "not_sure" })).status).toBe(200);
    expect(setChallengeTrack).toHaveBeenCalledWith(expect.objectContaining({ track: "not_sure" }));
  });
  it("rejects a missing, forged, expired or wrong-kind claim, and an unknown track", async () => {
    expect((await post({ track: "clarity" })).status).toBe(400);
    const good = claim();
    const forged = good.slice(0, -1) + (good.endsWith("a") ? "b" : "a"); // one character of the signature changed
    expect((await post({ claim: forged, track: "clarity" })).status).toBe(400);
    expect((await post({ claim: claim({ x: Date.now() - 1 }), track: "clarity" })).status).toBe(400);
    expect((await post({ claim: mk("challenge", { e: "a@b.co", f: "", l: "", x: Date.now() + 1e6 }), track: "clarity" })).status).toBe(400); // the emailed link is not a claim
    expect((await post({ claim: claim(), track: "other" })).status).toBe(400);
    expect(setChallengeTrack).not.toHaveBeenCalled();
  });
  it("answers 500 when Kit fails", async () => {
    setChallengeTrack.mockRejectedValueOnce(new Error("kit down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post({ claim: claim(), track: "content" })).status).toBe(500);
    spy.mockRestore();
  });
});
