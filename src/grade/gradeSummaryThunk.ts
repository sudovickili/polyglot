import { setGrade } from "@/state/appSlice"
import { Async } from "@/util/AsyncState"
import { gradeSummaryPrompt } from "./gradeSummary"
import { AppThunk } from "@/state/store"
import { streamObj } from "@/util/llm/generate"
import { GradeSchema } from "./Grade"

export const gradeSummaryThunk = (): AppThunk => async (dispatch, getState) => {
  const currentStory = getState().app.currentStory
  const story = getState().app.storiesById[currentStory.storyId]
  if (story.status !== "success") return

  const prompt = gradeSummaryPrompt({ story: story.val.story, summary: currentStory.summary })

  dispatch(setGrade(Async.loading()))
  streamObj(prompt, GradeSchema, (result) => {
    dispatch(setGrade(Async.fromResult(result)))
  })
}

export function DEBUG_gradeSummarySuccess() {
  return setGrade(Async.success({
    letter: 'A',
    reason: "Cause you're the man"
  }))
}