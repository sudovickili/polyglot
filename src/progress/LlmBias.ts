import { Word } from "@/wordData/Word";

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
