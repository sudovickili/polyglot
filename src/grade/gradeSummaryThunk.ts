import { setGrade } from "@/state/appSlice"
import { Async } from "@/util/AsyncState"
import { gradeSummary } from "./gradeSummary"
import { AppThunk } from "@/state/store"

export const gradeSummaryThunk = (): AppThunk => async (dispatch, getState) => {
  const currentStory = getState().app.currentStory
  const story = getState().app.storiesById[currentStory.storyId]
  if (story.status !== "success") return
  dispatch(setGrade(Async.loading()))
  const grade = await gradeSummary({
    story: story.val.story,
    summary: currentStory.summary,
  })
  dispatch(setGrade(Async.fromResult(grade)))

  // dispatch(setGrade(Async.success({
  //   letter: 'A',
  //   reason: "Cause you're the man"
  // })))
}