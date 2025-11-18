import { StoryIdSchema } from "@/story/Story";
import { unlerp } from "@/util/math";
import { WordSchema } from "@/dictionary/Word";
import z from "zod";

/** How many times a user must have seens a word without asking for a hint for it to be considered known */
export const KNOWN_THRESHOLD = 5;

export const WordStatsSchema = z.object({
  word: WordSchema,
  nSeen: z.number().default(0),
  nHints: z.number().default(0),
  nSeenSinceLastHint: z.number().default(0)
})
export type WordStats = z.infer<typeof WordStatsSchema>;

export function updateSeen(word: WordStats) {
  word.nSeen += 1;
  word.nSeenSinceLastHint += 1
}

export function updateHint(word: WordStats) {
  word.nHints += 1
  word.nSeenSinceLastHint = 0
}

export function isKnown(word: WordStats): boolean {
  return word.nSeenSinceLastHint >= KNOWN_THRESHOLD
}

export function isLearning(word: WordStats): boolean {
  return word.nSeenSinceLastHint < KNOWN_THRESHOLD
}

export const ProgressSchema = z.object({
  currentStoryId: StoryIdSchema,
  wordsSeen: z.record(WordSchema, WordStatsSchema)
})
export type Progress = z.infer<typeof ProgressSchema>;

export const seenWords = (progress: Progress) => Object.values(progress.wordsSeen)

/** Words that have been seen, but haven't needed a hint in a while */
export const knownWords = (progress: Progress) => seenWords(progress).filter(isKnown)

/** Words that needed a hint recently */
export const learningWords = (progress: Progress) => seenWords(progress).filter(isLearning)

/** Words that have been seen, but aren't being learned */
export const familiarWords = (progress: Progress) => seenWords(progress).filter((w) => !isLearning(w))
