import { Word } from "@/dictionary/Word";
import { Progress, seenWords, isKnown, isLearning } from "./Progress";
import { dict } from "@/dictionary/Dictionary";

/** Can be used to multiply llm logics by a bias factor for specific words.
 * 
 *  < 1 decreases the likelihood of the word being chosen
 *  > 1 increases the likelihood of the word being chosen
 */
export type LlmBias = Record<Word, number>;

export function combinedBias(a: LlmBias, b: LlmBias): LlmBias {
  const result = { ...a } as LlmBias;
  for (const [w, bias] of Object.entries(b)) {
    const word = w as Word;
    if (word in result) {
      result[word] += bias;
    } else {
      result[word] = bias;
    }
  }
  return result;
}

/** We want to create stories that favor the highest-frequency words for beginners
 * These high-frequency words will already be favored by the model by training,
 * but we may want to tip the scale further.
 */
export function llmBiasByWordFrequency(): LlmBias {
  const MAX_BIAS = 2.0 // The bias of the #1 most frequent word
  const NO_BIAS_RANKING = 3000 // Where the bias becomes 1.0
  const slope = (MAX_BIAS - 1.0) / (1 - NO_BIAS_RANKING)

  const llmBias: LlmBias = {}

  dict.all().forEach(entry => {
    const rank = entry.frequencyRanking
    if (rank !== null) {
      llmBias[entry.simplified as Word] = MAX_BIAS + slope * rank
    }
  })

  return llmBias
}

export function llmBiasForProgress(progress: Progress): LlmBias {
  const seen = seenWords(progress)

  const llmBias: LlmBias = {}

  seen.forEach(w => {
    let factor = 1.5 // More likely to see words you've seen before
    if (isKnown(w)) factor = 0.7 // Less likely to see known words
    if (isLearning(w)) factor = 2.0 // Much more likely to see words you're learning
    llmBias[w.word] = factor
  })

  return llmBias
}

export function printBiasForLlm(bias: LlmBias): string {
  return Object.entries(bias)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 200)
    .map(([word, factor]) => `${word}: ${factor.toFixed(1)}`)
    .join('\n');
}