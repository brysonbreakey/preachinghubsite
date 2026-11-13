import { beforeEach, describe, expect, it, vi } from "vitest";

const addChecklistContact = vi.fn(async () => {});
const tagRegularPreacher = vi.fn(async () => {});
const upsertChecklistContact = vi.fn(async () => {});
let recentLead: { id: string } | null = null;
const insert = vi.fn(async () => ({ error: null }));

vi.mock("dns/promises", () => ({ resolveMx: async () => [{ exchange: "mx.test", priority: 1 }] }));
vi.mock("@vercel/functions", () => ({ waitUntil: () => {} }));
vi.mock("@/lib/kit", () => ({
  addChecklistContact: (...a: unknown[]) => (addChecklistContact as (...x: unknown[]) => unknown)(...a),
  tagRegularPreacher: (...a: unknown[]) => (tagRegularPreacher as (...x: unknown[]) => unknown)(...a),
}));
vi.mock("@/lib/slicktext", () => ({ upsertChecklistContact: (...a: unknown[]) => (upsertChecklistContact as (...x: unknown[]) => unknown)(...a) }));
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ gte: () => ({ limit: () => ({ maybeSingle: async () => ({ data: recentLead }) }) }) }) }),
      insert,
    }),
  }),
}));

import { POST } from "./route";

const post = (over: Record<string, unknown> = {}) =>
  POST(
    new Request("https://x.test/api/checklist-signup", {
      method: "POST",
      body: JSON.stringify({ first_name: "Ann", last_name: "Lee", email: "ann@church.org", phone: "555-123-4567", ...over }),
    }) as never,
  ).then(async (r) => ({ status: r.status, body: await r.json() }));

describe("/api/checklist-signup: How often do you preach?", () => {
  beforeEach(() => {
    addChecklistContact.mockClear();
    tagRegularPreacher.mockClear();
    insert.mockClear();
    recentLead = null;
  });

  it("most weeks: tagged regular-preacher, sent to the thank-you page", async () => {
    const r = await post({ preach_frequency: "most_weeks" });
    expect(r.body).toEqual({ ok: true, next: "/checklist/thank-you" });
    expect(addChecklistContact).toHaveBeenCalledWith(expect.objectContaining({ email: "ann@church.org", regularPreacher: true }));
  });
  it("monthly and occasionally: not tagged, sent to /challenge with the checklist bar", async () => {
    for (const f of ["monthly", "occasionally"]) {
      addChecklistContact.mockClear();
      const r = await post({ preach_frequency: f });
      expect(r.body).toEqual({ ok: true, next: "/challenge?from=checklist" });
      expect(addChecklistContact).toHaveBeenCalledWith(expect.objectContaining({ regularPreacher: false }));
    }
  });
  it("no answer (old cached form): the old behavior, no regular-preacher tag", async () => {
    const r = await post();
    expect(r.body).toEqual({ ok: true, next: "/checklist/thank-you" });
    expect(addChecklistContact).toHaveBeenCalledWith(expect.objectContaining({ regularPreacher: false }));
  });
  it("a repeat signup within 24 hours: no second row or Kit signup, but still routed, and tagged if most weeks", async () => {
    recentLead = { id: "x" };
    const a = await post({ preach_frequency: "most_weeks" });
    expect(a.body).toEqual({ ok: true, next: "/checklist/thank-you" });
    expect(tagRegularPreacher).toHaveBeenCalledTimes(1);
    const b = await post({ preach_frequency: "monthly" });
    expect(b.body).toEqual({ ok: true, next: "/challenge?from=checklist" });
    expect(tagRegularPreacher).toHaveBeenCalledTimes(1);
    expect(addChecklistContact).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });
  it("still validates the rest of the form", async () => {
    expect((await post({ preach_frequency: "most_weeks", phone: "123" })).status).toBe(400);
  });
});
