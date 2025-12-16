import { learningWords, Progress, seenWords } from "./Progress"
import { getMostRecentParsedStories } from "@/state/util"
import { AppState } from "@/state/appSlice"
import { Log } from "@/util/Log"

export const RECENT_STORIES_THRESHOLD = 3

/** @deprecated use hintToSeenRatio_recent instead */
export const learningToSeenRatio_allTime = (progress: Progress): number => {
  const nSeen = seenWords(progress).length
  if (nSeen === 0) return 0
  const nLearning = learningWords(progress).length
  return nLearning / nSeen
}

/** A key indicator for tuning the learning curve
 * 
 * A high ratio means they're asking for a hint on every word they see.
 * 
 * A low ratio means they haven't needed any hints
 */
export const hintToSeenRatio_recent = (app: AppState): number => {
  const recentlyHintedWords = Object.entries(app.progress.wordsSeen)
    .filter(([_, wp]) => {
      if (wp.nStoriesSinceLastHint === undefined) return false
      return wp.nStoriesSinceLastHint <= RECENT_STORIES_THRESHOLD
    }).map(([word, _]) => word)

  const recentStories = getMostRecentParsedStories(app, RECENT_STORIES_THRESHOLD)
  const recentlySeenWords = new Set(recentStories.flatMap(story => story.parsedAll.map(p => p.word)))

  return recentlyHintedWords.length / recentlySeenWords.size
}
