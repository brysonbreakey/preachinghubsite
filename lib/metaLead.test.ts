import { describe, expect, it, vi } from "vitest";
import { LEAD_FLAG_KEY, fireQualifiedLead, markQualifiedLead } from "./metaLead";

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => { data[k] = v; },
    removeItem: (k: string) => { delete data[k]; },
  };
}

describe("Meta Lead event for people who preach most weeks", () => {
  it("fires Lead once, right after a qualified signup, then not again on refresh", () => {
    const storage = fakeStorage();
    const fbq = vi.fn();
    markQualifiedLead(storage);
    expect(fireQualifiedLead(storage, fbq)).toBe(true);
    expect(fbq).toHaveBeenCalledWith("track", "Lead", { content_name: "Pre-Preaching Checklist", content_category: "preaches_most_weeks" });
    expect(fireQualifiedLead(storage, fbq)).toBe(false); // a refresh
    expect(fbq).toHaveBeenCalledTimes(1);
  });
  it("never fires for a visit without the flag (an email link, a bookmark, other answers)", () => {
    const fbq = vi.fn();
    expect(fireQualifiedLead(fakeStorage(), fbq)).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
  });
  it("sends no personal information", () => {
    const storage = fakeStorage({ [LEAD_FLAG_KEY]: "1" });
    const fbq = vi.fn();
    fireQualifiedLead(storage, fbq);
    const params = fbq.mock.calls[0][2] as Record<string, unknown>;
    expect(Object.keys(params).sort()).toEqual(["content_category", "content_name"]); // only these two, both fixed text
    expect(JSON.stringify(fbq.mock.calls)).not.toContain("@");
  });
  it("copes with the pixel missing or storage blocked", () => {
    const storage = fakeStorage({ [LEAD_FLAG_KEY]: "1" });
    expect(fireQualifiedLead(storage, undefined)).toBe(false);
    const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} };
    expect(fireQualifiedLead(blocked, vi.fn())).toBe(false);
    expect(() => markQualifiedLead(blocked)).not.toThrow();
    expect(() => markQualifiedLead(undefined)).not.toThrow();
  });
});
