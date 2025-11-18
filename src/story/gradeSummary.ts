import { infoSection, serializeForLlm, serializeSchema } from '@/util/llm/promptUtil'
import { Grade, GradeSchema } from './Grade'
import { Story } from './Story'
import { APP_SUMMARY_FOR_LLM } from '@/app/appSummaryForLlm'
import { generateObj } from '@/util/llm/generate'

export interface Props {
  story: Story
  summary: string
}

export function gradeSummary({ story, summary }: Props): Promise<Grade> {
  const prompt = gradeSummaryPrompt({ story, summary })
  return generateObj<Grade>(prompt, GradeSchema)
}

function gradeSummaryPrompt({ story, summary }: Props): string {
  return `
You are an expert language learning tutor. Your task is to grade a user's understanding of a story they read in a foreign language. 

Your Tone: 
- Friendly, helpful, and informative.

IMPORTANT: Respond in english, but you may reference foreign language words as needed.

You operate within the Polyglot app.

${infoSection('App README', APP_SUMMARY_FOR_LLM)}
  
${infoSection('Required Response Format', serializeSchema(GradeSchema, 'Grade'))}

${infoSection('The Story', serializeForLlm(story))}

${infoSection('User Summary of the Story', summary)}
`
}
