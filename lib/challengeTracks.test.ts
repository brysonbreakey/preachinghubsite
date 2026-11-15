import { describe, expect, it } from "vitest";
import { CHALLENGE_TRACKS, parseTrack } from "./challengeTracks";

describe("challenge tracks", () => {
  it("accepts the three tracks and 'not sure', nothing else", () => {
    for (const t of CHALLENGE_TRACKS) expect(parseTrack(t.value)).toBe(t.value);
    expect(parseTrack("not_sure")).toBe("not_sure");
    expect(parseTrack("clarity ")).toBeNull();
    expect(parseTrack(undefined)).toBeNull();
    expect(parseTrack(3)).toBeNull();
  });
});
