import { unlerp } from "@/util/math";

// Alternatives: Proficiency, Aptitude
export const LEVELS = ["Beginner", "Emerging", "Intermediate", "Advanced", "Expert"] as const;
export type Level = typeof LEVELS[number];

export const WordsToExceed: Record<Level, number> = {
  Beginner: 100,
  Emerging: 300,
  Intermediate: 750,
  Advanced: 2000,
  Expert: 5000,
}
export function wordsToExceed(level?: Level): number {
  return level ? WordsToExceed[level] : 0;
}

export interface LevelInfo {
  level: Level;
  progressToNext: number;
}

export function computeLevel(nKnownWords: number): LevelInfo {
  // Find the highest level for which nKnownWords >= KnownWordsByLevel[level]
  let i = 0;
  for (const level of LEVELS) {
    if (nKnownWords >= WordsToExceed[level]) {
      i += 1;
    }
  }

  const level = LEVELS[i];
  const lastLevel: Level | undefined = LEVELS[i - 1];
  const progressToNext = unlerp({ start: wordsToExceed(lastLevel), end: wordsToExceed(level) }, nKnownWords)

  return {
    level,
    progressToNext
  };
}