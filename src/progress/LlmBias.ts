import { Word } from "@/dictionary/Word";
import { Progress, seenWords, isKnown, isLearning } from "./Progress";
import { dict } from "@/dictionary/Dictionary";
import { AppState } from "@/state/appSlice";

/** Bias the LLM's word selection.
 * Positive values increase the likelihood of the word being chosen.
 * Negative values decrease the likelihood.
 */
export type LlmBias = Record<Word, number>;

/** Combines multiple LlmBias objects into one by summing their values */
function combinedBias(biases: LlmBias[]): LlmBias {
  const result: LlmBias = {};

  for (const biasObj of biases) {
    for (const [w, bias] of Object.entries(biasObj)) {
      const word = w as Word;
      if (word in result) {
        result[word] += bias;
      } else {
        result[word] = bias;
      }
    }
  }

  return result;
}

/** Increases the likelihood of more common words being chosen
 * From (0.0 to 1.0) with the most frequent word having bias 2.0
 */
function llmBias_frequency(): LlmBias {
  const MAX_BIAS = 1.0 // The bias of the #1 most frequent word
  const NO_BIAS_RANKING = 3000 // Where the bias becomes 0.0
  const slope = - MAX_BIAS / NO_BIAS_RANKING

  const llmBias: LlmBias = {}

  dict.all().forEach(entry => {
    const rank = entry.frequencyRanking
    if (rank !== null) {
      llmBias[entry.simplified as Word] = Math.max(0.0, MAX_BIAS + slope * rank)
    }
  })

  return llmBias
}

/** Decreases the likelihood of recently seen words being chosen */
function llmBias_recency(state: AppState): LlmBias {
  const history = state.pastStories
  const recentStories = history.slice(-3).map(s => state.storiesById[s.storyId]).filter(s => s.status === 'success').map(s => s.val)
  const nStories = recentStories.length

  const llmBias: LlmBias = {}

  recentStories.reverse().forEach((story, idx) => {
    const wordCounts: Map<Word, number> = new Map()
    story.parsedAll.forEach(({ word }) => {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1)
    })
    const totalWords = story.parsedAll.length

    /** Older stories weighted less */
    const storyFactor = ((nStories - idx) / nStories)

    wordCounts.forEach((count, word) => {
      if (!(word in llmBias)) {
        llmBias[word] = 0
      }
      const wordRatio = count / totalWords
      /** A word that makes up 10% of the latest story gets -1.0 bias */
      llmBias[word] -= wordRatio * storyFactor * 10
    })
  })

  return llmBias
}

/** Increases the chance of learning words
 * Decreases the chance of known words
 * Slightly increases the chance of seen words
 */
function llmBias_progress(progress: Progress): LlmBias {
  const seen = seenWords(progress)

  const llmBias: LlmBias = {}

  seen.forEach(w => {
    let bias = 0.5 // More likely to see words you've seen before
    if (isKnown(w)) bias = -0.5 // Less likely to see known words
    if (isLearning(w)) bias = 1.0 // Much more likely to see words you're learning
    llmBias[w.word] = bias
  })

  return llmBias
}

export function totalLlmBias(state: AppState): LlmBias {
  console.log("frequency bias", JSON.stringify(llmBias_frequency()))
  console.log("recency bias", JSON.stringify(llmBias_recency(state)))
  console.log("progress bias", JSON.stringify(llmBias_progress(state.progress)))

  return combinedBias([
    llmBias_frequency(),
    llmBias_recency(state),
    llmBias_progress(state.progress)
  ])
}

export function printBiasForLlm(bias: LlmBias, limit: number): string {
  return Object.entries(bias)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word, factor]) => `${word}: ${factor.toFixed(1)}`)
    .join('\n');
}