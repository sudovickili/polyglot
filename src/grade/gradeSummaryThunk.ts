import { setGrade } from "@/state/appSlice"
import { gradeSummaryPrompt } from "./gradeSummaryPrompt"
import { AppThunk } from "@/state/store"
import { streamObj } from "@/util/llm/generate"
import { Grade, GradeSchema, isGradeLetter } from "./Grade"
import { createOpenAI } from "@ai-sdk/openai"
import { Streamed, StreamedState } from "@/util/StreamedState"
import z from "zod"
import { Log } from "@/util/Log"

/** Should be lower than story creation (0.7 - 0.9)
 * Correctness is more important than creativity here
 */
const GRADE_STORY_TEMPERATURE = 0.3;

const PartialGradeSchema = GradeSchema.extend({
  letter: z.string()
}).partial()
type PartialGrade = z.infer<typeof PartialGradeSchema>;


export const gradeSummaryThunk = (): AppThunk => async (dispatch, getState) => {
  const currentStory = getState().app.currentStory
  const story = getState().app.storiesById[currentStory.storyId]
  if (story.status !== "success") return

  dispatch(setGrade(Streamed.loading()))

  const prompt = gradeSummaryPrompt({ story: story.val.story, summary: currentStory.summary })
  Log.info("createStory prompt", prompt)

  const openAi = getState().app.secrets.openai

  streamObj({
    prompt,
    temperature: GRADE_STORY_TEMPERATURE,
    model: createOpenAI({
      apiKey: openAi.apiKey,
      organization: openAi.orgId
    })('gpt-4.1-nano')
  }, GradeSchema, PartialGradeSchema, (result) => {
    dispatch(setGrade(mapStreamedGrade(result)))
  })
}

function mapStreamedGrade(streamed: StreamedState<Grade, PartialGrade>): StreamedState<Grade> {
  switch (streamed.status) {
    case 'idle':
      return Streamed.idle();
    case 'loading': {
      const maybeLetter = streamed.partial?.letter;
      const grade: Grade = {
        letter: isGradeLetter(maybeLetter) ? maybeLetter : 'F',
        reason: streamed.partial?.reason || ''
      };
      return Streamed.loading(grade);
    }
    case 'success': {
      return Streamed.success(streamed.val);
    }
    case 'error':
      return Streamed.error(streamed.err);
  }
}

export function DEBUG_gradeSummarySuccess() {
  return setGrade(Streamed.success({
    letter: 'A',
    reason: "Cause you're the man"
  }))
}