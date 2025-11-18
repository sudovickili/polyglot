import { describe, it, expect } from "vitest";
import { computeLevel, LEVELS, WordsToExceed } from "./Level";

describe("computeLevel", () => {
  it("returns Beginner for 0 known words", () => {
    const info = computeLevel(0);
    expect(info).toStrictEqual({
      level: "Beginner",
      nKnownWords: 0,
      progressToNext: 0
    })
  });

  it("returns correct level for thresholds", () => {
    LEVELS.slice(0, -1).forEach((level, i) => {
      const n = WordsToExceed[level]
      const info = computeLevel(n);
      expect(info).toStrictEqual({
        level: LEVELS[i + 1],
        nKnownWords: n,
        progressToNext: 0
      })
    });
  });

  it("returns correct progression within level", () => {
    // Between Emerging and Intermediag
    const min = WordsToExceed.Beginner;
    const max = WordsToExceed.Emerging;
    const n = min + (max - min) / 2;
    const info = computeLevel(n);
    expect(info).toStrictEqual({
      level: "Emerging",
      nKnownWords: n,
      progressToNext: 0.5
    })
  });
});
