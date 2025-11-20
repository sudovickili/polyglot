import { infoSection, serializeForLlm, serializeSchema } from '@/util/llm/promptUtil'
import { Grade, GradeSchema } from './Grade'
import { Story } from '@/story/Story'
import { APP_SUMMARY_FOR_LLM } from '@/app/appSummaryForLlm'
import { generateObj } from '@/util/llm/generate'
import { Log } from '@/util/Log'

export interface Props {
  story: Story
  summary: string
}

export async function gradeSummary({ story, summary }: Props): Promise<Grade> {
  const prompt = gradeSummaryPrompt({ story, summary })
  Log.temp(`Grade Summary Prompt: ${prompt}`)
  const response = await generateObj<Grade>(prompt, GradeSchema)
  Log.temp(`Grade Summary Response: ${JSON.stringify(response, null, 2)}`)
  return response
}

function gradeSummaryPrompt({ story, summary }: Props): string {
  return `
You are an expert language learning tutor. Your task is to grade a user's understanding of a story they read in a foreign language. 

Your Tone: 
- Friendly, helpful, and informative. But honest and direct about the user's understanding.

Important Requirements:
- Respond in english, but you may reference foreign language words as needed.
- If the user's summary is empty, or clearly irrelevant to the story, they should not get a passing grade.
- The user's summary must be in English to get a passing grade.

Note:
- When the user receives their grade and the reasoning, the UI will present a button to re-read the story or continue to the next as appropriate. Do not re-state these instructions in your reasoning.

You operate within the Polyglot app.

${infoSection('App README', APP_SUMMARY_FOR_LLM)}
  
${infoSection('Required Response Format', serializeSchema(GradeSchema, 'Grade'))}

${infoSection('The Story That The User is Asked To Read And Understand', serializeForLlm(story))}

${infoSection('User Summary of the Story (In English). If this is empty, or irrelevant to the story. The user should not get a passing grade.', summary)}
`
}
