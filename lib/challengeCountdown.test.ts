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
const r = (id: number, start: string | null, current: string | null = null, day: string | null = "0"): Row => ({
  id,
  fields: { challenge_start_date: start, days_until_challenge_start: current, challenge_day: day },
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
    expect(writes).toEqual([[1, { days_until_challenge_start: "-14", challenge_day: "done" }]]);
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

describe("challenge_day in the same pass", () => {
  const runAt = async (today: string, rows: Row[]) => {
    const { api, writes } = fakeApi(rows);
    const s = await syncChallengeCountdown({ api, today, log: () => {} });
    return { s, writes };
  };

  it("sets both fields in one write, and only the ones that changed", async () => {
    // 2026-11-11 is day 2 of a Nov 10 cohort (countdown -1)
    const { writes } = await runAt("2026-11-11", [
      r(1, "2026-11-10", "0", "1"), // both stale
      r(2, "2026-11-10", "-1", "1"), // only day stale
      r(3, "2026-11-10", "-1", "2"), // both current
    ]);
    expect(writes).toEqual([
      [1, { days_until_challenge_start: "-1", challenge_day: "2" }],
      [2, { challenge_day: "2" }],
    ]);
  });

  it("walks a whole cohort: Fri/Sun half days, day 7 on Wed, then done", async () => {
    const expected: Record<string, string> = {
      "2026-11-09": "0", "2026-11-10": "1", "2026-11-11": "2", "2026-11-12": "3", "2026-11-13": "3.5",
      "2026-11-14": "4", "2026-11-15": "4.5", "2026-11-16": "5", "2026-11-17": "6", "2026-11-18": "7",
      "2026-11-19": "done", "2026-11-20": "done", "2026-11-21": "done",
    };
    for (const [today, day] of Object.entries(expected)) {
      const { writes } = await runAt(today, [r(1, "2026-11-10", null, null)]);
      expect(writes[0][1].challenge_day, today).toBe(day);
    }
  });

  it("a second cohort moves someone off 'done' without any setup", async () => {
    // joined cohort 1 (done), signs up for a Dec 1 cohort: start date changes, field resets to 0
    const { writes } = await runAt("2026-11-25", [r(1, "2026-12-01", "-5", "done")]);
    expect(writes).toEqual([[1, { days_until_challenge_start: "6", challenge_day: "0" }]]);
  });

  it("leaves finished cohorts alone once 'done' is written", async () => {
    const { s, writes } = await runAt("2026-11-24", [r(1, "2026-11-10", "-14", "done")]);
    expect(writes).toEqual([]);
    expect(s.unchanged).toBe(1);
  });
});

describe("only: one field per job", () => {
  it("the 5 AM countdown leaves challenge_day alone, the 3 PM job leaves the countdown alone", async () => {
    const rows = [r(1, "2026-11-10", "0", "0")];
    const a = fakeApi(rows);
    await syncChallengeCountdown({ api: a.api, today: "2026-11-11", only: "countdown", log: () => {} });
    expect(a.writes).toEqual([[1, { days_until_challenge_start: "-1" }]]);
    const b = fakeApi(rows);
    await syncChallengeCountdown({ api: b.api, today: "2026-11-11", dayToday: "2026-11-10", only: "day", log: () => {} });
    expect(b.writes).toEqual([[1, { challenge_day: "1" }]]);
  });
});

describe("send times in the job", () => {
  it("writes challenge_day at the real moments for a Nov 10 cohort", async () => {
    const at = async (iso: string, current: string) => {
      const { api, writes } = fakeApi([r(1, "2026-11-10", null, current)]);
      await syncChallengeCountdown({ api, now: new Date(iso), only: "day", log: () => {} });
      return writes;
    };
    expect(await at("2026-11-10T15:30:00Z", "0")).toEqual([]); // 9:30 AM Tue: no change
    expect(await at("2026-11-10T20:20:00Z", "0")).toEqual([[1, { challenge_day: "1" }]]); // 2:20 PM
    expect(await at("2026-11-10T20:20:00Z", "1")).toEqual([]); // backup run: no-op
    expect(await at("2026-11-11T15:05:00Z", "1")).toEqual([[1, { challenge_day: "2" }]]); // 9:05 AM Wed
  });
});
