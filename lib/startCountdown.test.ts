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

import { computeChallengeDay as day, offWeekdaysFor } from "./startCountdown";

describe("computeChallengeDay", () => {
  it("is null for a missing or invalid start date", () => {
    expect(day("", "2026-11-10")).toBeNull();
    expect(day("2026-02-30", "2026-11-10")).toBeNull();
  });
  it("runs the Nov 10 cohort: Friday and Sunday are half days", () => {
    const expected: Record<string, string> = {
      "2026-11-09": "0", "2026-11-10": "1", "2026-11-11": "2", "2026-11-12": "3", "2026-11-13": "3.5",
      "2026-11-14": "4", "2026-11-15": "4.5", "2026-11-16": "5", "2026-11-17": "6", "2026-11-18": "7",
      "2026-11-19": "done", "2026-11-20": "done", "2026-11-22": "done",
    };
    for (const [today, v] of Object.entries(expected)) expect(day("2026-11-10", today), today).toBe(v);
  });
  it("runs the Nov 17 cohort: 7 days in a row, no half days", () => {
    const expected: Record<string, string> = {
      "2026-11-16": "0", "2026-11-17": "1", "2026-11-18": "2", "2026-11-19": "3", "2026-11-20": "4",
      "2026-11-21": "5", "2026-11-22": "6", "2026-11-23": "7", "2026-11-24": "done", "2026-11-30": "done",
    };
    for (const [today, v] of Object.entries(expected)) expect(day("2026-11-17", today), today).toBe(v);
  });
  it("only the Nov 10 pilot has days off; any other cohort has none unless given", () => {
    expect(offWeekdaysFor("2026-11-10")).toEqual([0, 5]);
    expect(offWeekdaysFor("2026-11-17")).toEqual([]);
    expect(offWeekdaysFor("")).toEqual([]);
    const off = [0, 5];
    expect(day("2026-11-16", "2026-11-20", off)).toBe("4.5"); // Mon start: 16-19 = days 1-4, Fri 20 = 4.5
    expect(day("2026-11-16", "2026-11-24", off)).toBe("7");
    expect(day("2026-11-16", "2026-11-25", off)).toBe("done");
    expect(day("2026-11-13", "2026-11-13", off)).toBe("0"); // starting on an off day: not yet day 1
    expect(day("2026-11-13", "2026-11-14", off)).toBe("1");
  });
  it("is not thrown off by daylight saving", () => {
    expect(day("2026-10-30", "2026-11-03")).toBe("5"); // Oct 30 to Nov 3 crosses the clocks changing
  });
});

import { challengeDayDate, challengeDayFor } from "./startCountdown";

describe("send times: 9 AM daily, Day 1 at 2:15 PM (Central)", () => {
  // Nov 2026 is CST (UTC-6): 9:00 AM = 15:00Z, 2:15 PM = 20:15Z
  const at = (iso: string) => new Date(iso);
  it("daily date flips at 9:00 AM", () => {
    expect(challengeDayDate(at("2026-11-11T14:59:00Z"))).toBe("2026-11-10");
    expect(challengeDayDate(at("2026-11-11T15:00:00Z"))).toBe("2026-11-11");
  });
  it("Day 1 waits for 2:15 PM, then everything else flips at 9 AM", () => {
    const f = (iso: string) => challengeDayFor("2026-11-10", at(iso));
    expect(f("2026-11-10T13:00:00Z")).toBe("0"); // 7:00 AM Tue
    expect(f("2026-11-10T15:30:00Z")).toBe("0"); // 9:30 AM Tue: Day 1 not open yet
    expect(f("2026-11-10T19:00:00Z")).toBe("0"); // 1:00 PM, the call
    expect(f("2026-11-10T20:14:00Z")).toBe("0"); // 2:14 PM
    expect(f("2026-11-10T20:15:00Z")).toBe("1"); // 2:15 PM
    expect(f("2026-11-10T23:00:00Z")).toBe("1"); // 5:00 PM late signup
    expect(f("2026-11-11T14:00:00Z")).toBe("1"); // 8:00 AM Wed: still 1
    expect(f("2026-11-11T15:00:00Z")).toBe("2"); // 9:00 AM Wed
    expect(f("2026-11-13T15:00:00Z")).toBe("3.5"); // Fri 9 AM
    expect(f("2026-11-19T15:00:00Z")).toBe("done"); // Thu after day 7
  });
});

import { countdownDate } from "./startCountdown";

describe("countdownDate (the countdown flips at 11:00 AM Central)", () => {
  // Nov 2026 is CST (UTC-6): 11:00 AM = 17:00Z
  it("is yesterday before 11:00 AM and today from 11:00 AM", () => {
    expect(countdownDate(new Date("2026-11-12T16:59:00Z"))).toBe("2026-11-11"); // 10:59 AM
    expect(countdownDate(new Date("2026-11-12T17:00:00Z"))).toBe("2026-11-12"); // 11:00 AM
    expect(countdownDate(new Date("2026-11-13T03:00:00Z"))).toBe("2026-11-12"); // 9:00 PM
    expect(countdownDate(new Date("2026-11-12T11:00:00Z"))).toBe("2026-11-11"); // 5:00 AM: no longer the flip
  });
  it("gives the right countdown number: 7 on Nov 10, until 11 AM on Nov 11", () => {
    expect(days("2026-11-17", countdownDate(new Date("2026-11-10T17:00:00Z")))).toBe(7);
    expect(days("2026-11-17", countdownDate(new Date("2026-11-11T16:00:00Z")))).toBe(7); // 10 AM: still 7
    expect(days("2026-11-17", countdownDate(new Date("2026-11-11T17:00:00Z")))).toBe(6);
    expect(days("2026-11-17", countdownDate(new Date("2026-11-17T17:00:00Z")))).toBe(0);
  });
});
