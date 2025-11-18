import { infoSection, serializeForLlm, serializeSchema } from '@/util/llm/promptUtil'
import { StoryResponse, StoryResponseSchema } from './Story'
import { APP_SUMMARY_FOR_LLM } from '@/app/appSummaryForLlm'
import { generateObj } from '@/util/llm/generate'
import { Progress } from '@/progress/Progress'
import { llmBiasByProgress } from '@/progress/LlmBias'

const TARGET_LANGUAGE = "Chinese (Simplified)"

interface Props {
  progress: Progress
}

export function createStory(props: Props): Promise<StoryResponse> {
  const prompt = createStoryPrompt(props)
  return generateObj<StoryResponse>(prompt, StoryResponseSchema)
}

function createStoryPrompt(props: Props): string {
  const llmBias = llmBiasByProgress(props.progress)

  return `
You are an expert language learning tutor. Your task is to create a story in a foreign language that is tailor-made for the user's proficiency in that language.

Your Tone: 
- Friendly, helpful, and informative.

IMPORTANT: The story should be entirely in ${TARGET_LANGUAGE}.

You operate within the Polyglot app.

${infoSection('App README', APP_SUMMARY_FOR_LLM)}
  
${infoSection('Required Response Format', serializeSchema(StoryResponseSchema, 'StoryResponse'))}

${infoSection('Favored Words With Weight. Prefer to include these words in the story', serializeForLlm(llmBias))}
`
}

