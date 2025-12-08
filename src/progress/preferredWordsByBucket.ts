import { AppState } from "@/state/appSlice";
import { lerp } from "@/util/math";
import { buckets, unseenWords } from "./Progress";
import { combinedBias, llmBias_frequency, llmBias_recency } from "./LlmBias";
import { Word } from "@/dictionary/Word";
import { distributeByWeight } from "@/util/math/distributeByWeight";
import { hintToSeenRatio_recent } from "./hintToSeenRatio";

export const PREFERRED_WORDS_LIMIT = 100;

interface BucketWeights {
  learning: number;
  known: number;
  familiar: number;
  unseen: number;
}

/** The preferred mixture of words based on the minimum learning to seen ratio (user hasn't looked up anything) */
export const minHsRatioBucketWeights: BucketWeights = {
  learning: 1.0,
  known: 0.0,
  familiar: 0.5,
  unseen: 0.3,
}

/** The preferred mixture of words based on the maximum learning to seen ratio (user has looked up every word they see) */
export const maxHsRatioBucketWeights: BucketWeights = {
  learning: 0.1,
  known: 1.0,
  familiar: 0.1,
  unseen: 0.03,
}

function lerpWeights<K extends string>(a: Record<K, number>, b: Record<K, number>, ratio: number): Record<K, number> {
  const result: Record<K, number> = {} as Record<K, number>;
  for (const key in a) {
    result[key] = lerp({ start: a[key], end: b[key] }, ratio);
  }
  return result;
}

export function targetBucketWeights(hsRatio: number): BucketWeights {
  return lerpWeights(minHsRatioBucketWeights, maxHsRatioBucketWeights, hsRatio);
}

/** Prints a list of words the LLM should prefer to use in stories by bucketing words in categories
 * - learning
 * - known
 * - familiar
 * - unseen
 * 
 * Sorting them based on frequency and recency
 * And distributing them according to the user's hint / seen ratio
 */
export function preferredWordsByBucket(state: AppState): Word[] {
  const { progress } = state
  const hintToSeenRatio = hintToSeenRatio_recent(state)
  const bucketWeights = targetBucketWeights(hintToSeenRatio)

  const llmBias = combinedBias([
    llmBias_frequency(),
    llmBias_recency(state),
  ])
  const cmp = getCompareFunction(llmBias)

  let { learning, known, familiar } = buckets(progress)

  const learningWords = learning.map(w => w.word).sort(cmp)
  const knownWords = known.map(w => w.word).sort(cmp)
  const familiarWords = familiar.map(w => w.word).sort(cmp)
  const unseenWords_ = unseenWords(progress).sort(cmp)

  const words = distributeByWeight<Word>([
    { items: learningWords, weight: bucketWeights.learning },
    { items: knownWords, weight: bucketWeights.known },
    { items: familiarWords, weight: bucketWeights.familiar },
    { items: unseenWords_, weight: bucketWeights.unseen },
  ])

  return words.slice(0, PREFERRED_WORDS_LIMIT)
}

export function printPreferredWordsByBucket(state: AppState): string {
  const words = preferredWordsByBucket(state)
  const n = words.length
  return words.map((w, i) => `${i + 1}. ${w}${i === 0 ? " (highest priority)" : ""}${i === n - 1 ? " (lowest priority)" : ""}`)
    .join("\n")
}

const getCompareFunction = (llmBias: Record<Word, number>) => (a: Word, b: Word): number => {
  const biasA = llmBias[a] ?? 0.0
  const biasB = llmBias[b] ?? 0.0
  return biasB - biasA
}