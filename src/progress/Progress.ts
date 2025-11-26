import { isNotWord, NOT_WORDS } from "@/dictionary/notWords";
import { Word, WordSchema } from "@/dictionary/Word";
import z from "zod";

/** How many times a user must have seens a word without asking for a hint for it to be considered known */
export const KNOWN_THRESHOLD = 5;

export const WordStatsSchema = z.object({
  word: WordSchema,
  nSeen: z.number(),
  nHints: z.number(),
  nSeenSinceLastHint: z.number().optional(),
  hintedThisStory: z.boolean().optional(),
})
export type WordStats = z.infer<typeof WordStatsSchema>;
export function getOrCreateWordStats(wordsSeen: Record<Word, WordStats>, word: Word): WordStats {
  if (!wordsSeen[word]) {
    wordsSeen[word] = {
      word,
      nSeen: 0,
      nHints: 0,
    }
  }
  return wordsSeen[word]
}

/** When a hint is given during the story */
export function updateHint(word: WordStats) {
  word.nHints += 1
  word.nSeenSinceLastHint = 0
  word.hintedThisStory = true
}

/** After the story */
function updateSeen(word: WordStats, count: number) {
  word.nSeen += count;
  if (!word.hintedThisStory && word.nSeenSinceLastHint !== undefined) {
    word.nSeenSinceLastHint += count
  }
  delete word.hintedThisStory
}

export function updateProgressForCompletedStory(progress: Progress, words: Word[]) {
  const wordCounts = words.filter(word => !isNotWord(word)).reduce<Map<Word, number>>((acc, w) => {
    acc.set(w, (acc.get(w) || 0) + 1)
    return acc
  }, new Map<Word, number>())

  wordCounts.forEach((count, w) => {
    const stats = getOrCreateWordStats(progress.wordsSeen, w)
    updateSeen(stats, count)
  })
}

export function isKnown(word: WordStats): boolean {
  if (word.nSeenSinceLastHint === undefined) {
    return word.nSeen >= KNOWN_THRESHOLD
  }
  return word.nSeenSinceLastHint >= KNOWN_THRESHOLD
}

export function isLearning(word: WordStats): boolean {
  if (word.nSeenSinceLastHint === undefined) return false;
  return word.nSeenSinceLastHint < KNOWN_THRESHOLD
}

export const ProgressSchema = z.object({
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
