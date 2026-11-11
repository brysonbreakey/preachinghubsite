import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { verifyStripeSignature } from "./stripe";

const sign = (body: string, secret: string, t: number) =>
  `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

describe("verifyStripeSignature", () => {
  const body = '{"id":"evt_1"}';
  const now = 1_800_000_000_000;
  const t = now / 1000;
  it("accepts a correct signature", () => expect(verifyStripeSignature(body, sign(body, "whsec_a", t), "whsec_a", now)).toBe(true));
  it("rejects a wrong secret, a changed body, a stale time and a missing header", () => {
    expect(verifyStripeSignature(body, sign(body, "whsec_a", t), "whsec_b", now)).toBe(false);
    expect(verifyStripeSignature(body + " ", sign(body, "whsec_a", t), "whsec_a", now)).toBe(false);
    expect(verifyStripeSignature(body, sign(body, "whsec_a", t - 600), "whsec_a", now)).toBe(false);
    expect(verifyStripeSignature(body, null, "whsec_a", now)).toBe(false);
    expect(verifyStripeSignature(body, "t=1,v1=zz", "whsec_a", now)).toBe(false);
  });
  it("accepts when one of several v1 signatures matches (secret rotation)", () => {
    const good = sign(body, "whsec_a", t);
    expect(verifyStripeSignature(body, `${good},v1=${"0".repeat(64)}`, "whsec_a", now)).toBe(true);
  });
});
