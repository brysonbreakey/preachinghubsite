import { describe, expect, it } from "vitest";
import { chicagoToday, computeDaysUntilChallengeStart as days } from "./startCountdown";

describe("computeDaysUntilChallengeStart", () => {
  it("counts whole days down to the start", () => {
    expect(days("2026-11-10", "2026-11-03")).toBe(7);
    expect(days("2026-11-10", "2026-11-05")).toBe(5);
    expect(days("2026-11-10", "2026-11-09")).toBe(1);
  });
  it("is 0 on the day itself", () => expect(days("2026-11-10", "2026-11-10")).toBe(0));
  it("goes negative after the start", () => {
    expect(days("2026-11-10", "2026-11-11")).toBe(-1);
    expect(days("2026-11-10", "2026-11-24")).toBe(-14);
    expect(days("2026-11-10", "2026-11-25")).toBe(-15);
  });
  it("is unaffected by daylight-saving changes", () => {
    expect(days("2026-03-09", "2026-03-07")).toBe(2); // spring forward Mar 8
    expect(days("2026-11-02", "2026-10-31")).toBe(2); // fall back Nov 1
    expect(days("2026-11-02", "2026-11-01")).toBe(1);
    expect(days("2027-01-01", "2026-11-01")).toBe(61);
  });
  it("handles month, year and leap-day boundaries", () => {
    expect(days("2027-01-02", "2026-12-31")).toBe(2);
    expect(days("2028-03-01", "2028-02-28")).toBe(2);
  });
  it("returns null for missing or invalid dates", () => {
    for (const bad of [null, undefined, "", "  ", "nonsense", "11/10/2026", "2026-11-10T00:00:00Z", "2026-02-30", "2026-13-01", "2026-00-10"]) {
      expect(days(bad, "2026-11-10")).toBeNull();
    }
    expect(days("2026-11-10", "bad")).toBeNull();
  });
  it("reads a Date as today's date in Chicago, not UTC", () => {
    // 2026-11-11 03:00 UTC is still Nov 10, 9 PM in Chicago.
    expect(days("2026-11-10", new Date("2026-11-11T03:00:00Z"))).toBe(0);
    // 2026-11-10 05:59 UTC is Nov 9, 11:59 PM in Chicago; 06:00 UTC is Nov 10 midnight.
    expect(days("2026-11-10", new Date("2026-11-10T05:59:00Z"))).toBe(1);
    expect(days("2026-11-10", new Date("2026-11-10T06:00:00Z"))).toBe(0);
    // Summer (CDT, UTC-5): 04:59 UTC is still the previous evening.
    expect(chicagoToday(new Date("2026-07-04T04:59:00Z"))).toBe("2026-07-03");
    expect(chicagoToday(new Date("2026-07-04T05:00:00Z"))).toBe("2026-07-04");
  });
});
