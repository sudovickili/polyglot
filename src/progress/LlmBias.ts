import { Word } from "@/dictionary/Word";
import { knownWords, learningWords, Progress, familiarWords, seenWords, isKnown, isLearning } from "./Progress";
import { computeLevel } from "./Level";

/** Can be used to multiply llm logics by a bias factor for specific words.
 * 
 *  < 1 decreases the likelihood of the word being chosen
 *  > 1 increases the likelihood of the word being chosen
 */
export type LlmBias = Record<Word, number>;

export function combined(a: LlmBias, b: LlmBias): LlmBias {
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
  return {}
}

export function llmBiasByProgress(progress: Progress): LlmBias {
  const seen = seenWords(progress)

  const llmBias: LlmBias = {}

  seen.forEach(w => {
    let factor = 2
    if (isKnown(w)) factor *= 0.9
    if (isLearning(w)) factor *= 2.0
    llmBias[w.word] = factor
  })

  return llmBias
}