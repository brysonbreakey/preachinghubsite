import { describe, expect, it, vi } from "vitest";
import { syncChallengeCountdown, type KitCountdownApi } from "./challengeCountdown";

type Row = { id: number; fields: Record<string, string | null> | null };

function fakeApi(rows: Row[], opts: { fieldExists?: boolean; failIds?: number[]; pageSize?: number } = {}) {
  const writes: Array<[number, Record<string, string>]> = [];
  const pageSize = opts.pageSize ?? 100;
  const api: KitCountdownApi = {
    findCustomFieldId: async () => (opts.fieldExists === false ? null : 1),
    listTagSubscribers: async (_tag, after) => {
      const start = after ? Number(after) : 0;
      const slice = rows.slice(start, start + pageSize);
      const end = start + pageSize;
      return { subscribers: slice, hasNextPage: end < rows.length, endCursor: String(end) };
    },
    getSubscriber: async (id) => rows.find((r) => r.id === id)!,
    updateFields: async (id, fields) => {
      if (opts.failIds?.includes(id)) throw new Error("boom");
      writes.push([id, fields]);
    },
  };
  return { api, writes };
}

const run = (rows: Row[], o: Parameters<typeof fakeApi>[1] = {}, dryRun = false) => {
  const { api, writes } = fakeApi(rows, o);
  return syncChallengeCountdown({ api, today: "2026-11-05", dryRun, log: () => {} }).then((s) => ({ s, writes }));
};
const r = (id: number, start: string | null, current: string | null = null): Row => ({
  id,
  fields: { challenge_start_date: start, days_until_challenge_start: current },
});

describe("syncChallengeCountdown", () => {
  it("writes only when the value changed, and counts everything", async () => {
    const { s, writes } = await run([
      r(1, "2026-11-10"), // empty -> 5
      r(2, "2026-11-10", "6"), // 6 -> 5
      r(3, "2026-11-10", "5"), // already 5
      r(4, null), // no start date
      r(5, "garbage"), // unparseable
    ]);
    expect(writes).toEqual([
      [1, { days_until_challenge_start: "5" }],
      [2, { days_until_challenge_start: "5" }],
    ]);
    expect(s).toMatchObject({ checked: 5, updated: 2, unchanged: 1, skipped: 2, failed: 0 });
  });

  it("writes down to -14 and leaves anything older alone", async () => {
    const { s, writes } = await run([r(1, "2026-10-22"), r(2, "2026-10-21"), r(3, "2026-09-01", "3")]);
    expect(writes).toEqual([[1, { days_until_challenge_start: "-14" }]]);
    expect(s).toMatchObject({ updated: 1, unchanged: 2 });
  });

  it("follows pagination", async () => {
    const rows = Array.from({ length: 7 }, (_, i) => r(i + 1, "2026-11-10"));
    const { s, writes } = await run(rows, { pageSize: 3 });
    expect(s.checked).toBe(7);
    expect(writes).toHaveLength(7);
  });

  it("looks the subscriber up when the tag listing has no custom fields", async () => {
    const full = r(1, "2026-11-10");
    const rows: Row[] = [{ id: 1, fields: null }];
    const { api, writes } = fakeApi(rows);
    api.getSubscriber = async () => full;
    const s = await syncChallengeCountdown({ api, today: "2026-11-05", log: () => {} });
    expect(writes).toEqual([[1, { days_until_challenge_start: "5" }]]);
    expect(s.updated).toBe(1);
  });

  it("counts a failed write and keeps going", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { s, writes } = await run([r(1, "2026-11-10"), r(2, "2026-11-10")], { failIds: [1] });
    spy.mockRestore();
    expect(writes.map((w) => w[0])).toEqual([2]);
    expect(s).toMatchObject({ checked: 2, updated: 1, failed: 1 });
  });

  it("dry run reports intended changes and writes nothing", async () => {
    const lines: string[] = [];
    const { api, writes } = fakeApi([r(1, "2026-11-10"), r(2, "2026-11-10", "5")]);
    const s = await syncChallengeCountdown({ api, today: "2026-11-05", dryRun: true, log: (m) => lines.push(m) });
    expect(writes).toEqual([]);
    expect(s).toMatchObject({ dryRun: true, updated: 1, unchanged: 1 });
    expect(lines.some((l) => l.includes("subscriber 1") && l.includes("-> 5"))).toBe(true);
  });

  it("never logs an email address when skipping", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await run([{ id: 9, fields: { challenge_start_date: "", days_until_challenge_start: null } }]);
    expect(warn.mock.calls[0][0]).toContain("subscriber 9");
    expect(String(warn.mock.calls[0][0])).not.toContain("@");
    warn.mockRestore();
  });

  it("stops with a clear error if the Kit field is missing", async () => {
    const { api } = fakeApi([], { fieldExists: false });
    await expect(syncChallengeCountdown({ api, log: () => {} })).rejects.toThrow(/days_until_challenge_start/);
  });
});
