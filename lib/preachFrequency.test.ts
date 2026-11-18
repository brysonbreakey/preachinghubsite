import { describe, expect, it } from "vitest";
import { nextPageFor, parsePreachFrequency } from "./preachFrequency";

describe("preach frequency routing", () => {
  it("most weeks goes to the thank-you page (Meta Pixel); monthly and occasionally go to /challenge", () => {
    expect(nextPageFor("most_weeks")).toBe("/checklist/thank-you");
    expect(nextPageFor("monthly")).toBe("/challenge?from=checklist");
    expect(nextPageFor("occasionally")).toBe("/challenge?from=checklist");
  });
  it("no answer (an old cached form) keeps the old behavior", () => {
    expect(nextPageFor(null)).toBe("/checklist/thank-you");
  });
  it("only accepts the three answers", () => {
    expect(parsePreachFrequency("most_weeks")).toBe("most_weeks");
    expect(parsePreachFrequency("monthly")).toBe("monthly");
    expect(parsePreachFrequency("occasionally")).toBe("occasionally");
    expect(parsePreachFrequency("weekly")).toBeNull();
    expect(parsePreachFrequency(undefined)).toBeNull();
    expect(parsePreachFrequency(5)).toBeNull();
  });
});
