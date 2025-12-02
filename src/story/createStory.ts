import { infoSection, serializeForLlm } from '@/util/llm/promptUtil'
import { knownWords, Progress } from '@/progress/Progress'
import { combinedBias, llmBiasByWordFrequency, llmBiasForProgress, printBiasForLlm } from '@/progress/LlmBias'
import { computeLevel, Level } from '@/progress/Level'
import { StoryEval } from './StoryEval'
import { AppState } from '@/state/appSlice'

const TARGET_LANGUAGE = "Chinese (Simplified)"

export function createStoryPrompt(appState: AppState): string {
  const llmBias_progress = llmBiasForProgress(appState.progress)
  const llmBias_frequency = llmBiasByWordFrequency()
  const llmBias = combinedBias(llmBias_progress, llmBias_frequency)

  const history = appState.pastStories
  const recentStories = history.slice(-2).map(s => appState.storiesById[s.storyId]).filter(s => s.status === 'success').map(s => s.val.story)

  const level = computeLevel(knownWords(appState.progress).length)

  return `
You are an expert language learning tutor. Your task is to create a story in a foreign language that is tailor-made for the user's proficiency in that language.

Your Tone: 
- Friendly, helpful, and informative.

Important Requirements:
- The story MUST be entirely in ${TARGET_LANGUAGE}.
- The story MUST be engaging and appropriate for the user's proficiency level.
- The story MUST incorporate the favored words provided, giving preference to higher-weighted words.

${infoSection(`Here's an overview of the user's language level. The story MUST be appropriate for this level`, `${level.level}\n\n${LEVEL_EXPLANATIONS[level.level]}`)}

${infoSection('Here are the last 2 stories the user has read. Use these to avoid repetition and ensure variety', serializeForLlm(recentStories))}

${infoSection('Favored Words With Weight. Prefer to include these words in the story based on the factor', printBiasForLlm(llmBias))}
`
}

const LEVEL_EXPLANATIONS: Record<Level, string> = {
  'Beginner': 'The user has little to no understanding of the language. They are just starting to learn the language and have a limited vocabulary. Only include very simple, common words. The story must be very short, no more than 100 words. Separate sentences/phrases with line breaks to aid comprehension.',
  'Emerging': 'The user is able to understand and use some basic phrases and sentences. Vocabulary is still limited, but they can handle simple stories with familiar topics and slightly longer sentences. Use mostly common words and simple grammar. The story must be short, no more than 100-200 words.',
  'Intermediate': 'The user can understand and communicate using a wider range of vocabulary and more complex sentences. The story can include some less common words and more varied sentence structures, but should still avoid advanced idioms or highly technical language. The story should be around 200-300 words.',
  'Advanced': 'The user has a strong grasp of the language, including complex grammar and a broad vocabulary. The story can include advanced sentence structures, idiomatic expressions, and nuanced language. Topics can be more sophisticated and abstract. The story should be 300 - 500 words',
  'Expert': 'The user is highly proficient and can understand and produce language at a near-native level. The story can include highly complex language, idioms, cultural references, and advanced vocabulary. Feel free to use literary devices and explore challenging topics. The story should be about 500 words.'
}