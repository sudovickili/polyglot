import { isNotWord, NOT_WORDS } from "@/dictionary/notWords";
import { Word, WordSchema } from "@/dictionary/Word";
import z from "zod";

/** How many times a user must have seens a word without asking for a hint for it to be considered known */
export const KNOWN_THRESHOLD = 3;

export const WordProgressSchema = z.object({
  word: WordSchema,
  nSeen: z.number(),
  nHints: z.number(),
  nSeenSinceLastHint: z.number().optional(),
  hintedThisStory: z.boolean().optional(),
})
export type WordProgress = z.infer<typeof WordProgressSchema>;
export function getOrCreateWordStats(wordsSeen: Record<Word, WordProgress>, word: Word): WordProgress {
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
export function updateHint(word: WordProgress) {
  word.nHints += 1
  word.nSeenSinceLastHint = 0
  word.hintedThisStory = true
}

/** After the story */
function updateSeen(word: WordProgress, count: number) {
  word.nSeen += count;
  if (!word.hintedThisStory && word.nSeenSinceLastHint !== undefined) {
    word.nSeenSinceLastHint += count
  }
  delete word.hintedThisStory
}

export function updateProgressForCompletedStory(progress: Progress, words: Word[]) {
  const knownWordsBeforeCompletion = new Set(knownWords(progress).map(w => w.word))

  const wordCounts = words.filter(word => !isNotWord(word)).reduce<Map<Word, number>>((acc, w) => {
    acc.set(w, (acc.get(w) || 0) + 1)
    return acc
  }, new Map<Word, number>())

  wordCounts.forEach((count, w) => {
    const stats = getOrCreateWordStats(progress.wordsSeen, w)
    updateSeen(stats, count)
  })

  const knownWordsAfterCompletion = knownWords(progress).map(w => w.word)
  const newKnownWords = knownWordsAfterCompletion.filter(w => !knownWordsBeforeCompletion.has(w))
  progress.newKnownWords = newKnownWords
}

export function isKnown(word: WordProgress): boolean {
  if (word.nSeenSinceLastHint === undefined) {
    return word.nSeen >= KNOWN_THRESHOLD
  }
  return word.nSeenSinceLastHint >= KNOWN_THRESHOLD
}

export function isLearning(word: WordProgress): boolean {
  if (word.nSeenSinceLastHint === undefined) return false;
  return word.nSeenSinceLastHint < KNOWN_THRESHOLD
}

export const ProgressSchema = z.object({
  wordsSeen: z.record(WordSchema, WordProgressSchema),
  newKnownWords: z.array(WordSchema).default([]),
})
export type Progress = z.infer<typeof ProgressSchema>;

export const seenWords = (progress: Progress) => Object.values(progress.wordsSeen)

/** Words that have been seen, but haven't needed a hint in a while */
export const knownWords = (progress: Progress) => seenWords(progress).filter(isKnown)

/** Words that needed a hint recently */
export const learningWords = (progress: Progress) => seenWords(progress).filter(isLearning)

/** Words that have been seen, but aren't known or being learned */
export const familiarWords = (progress: Progress) => seenWords(progress).filter((w) => !isLearning(w) && !isKnown(w));

/** A key indicator for tuning the learning curve
 * 
 * A high ratio means they're asking for a hint on every word they see.
 * 
 * A low ratio means they don't need any hints
 */
export const learningToSeenRatio = (progress: Progress): number => {
  const nSeen = seenWords(progress).length
  if (nSeen === 0) return 0
  const nLearning = learningWords(progress).length
  return nLearning / nSeen
}