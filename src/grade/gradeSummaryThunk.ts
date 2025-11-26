import { setGrade } from "@/state/appSlice"
import { gradeSummaryPrompt } from "./gradeSummary"
import { AppThunk } from "@/state/store"
import { streamObj } from "@/util/llm/generate"
import { Grade, GradeSchema } from "./Grade"
import { Streamed, StreamedState } from "@/util/StreamedState"

export const gradeSummaryThunk = (): AppThunk => async (dispatch, getState) => {
  const currentStory = getState().app.currentStory
  const story = getState().app.storiesById[currentStory.storyId]
  if (story.status !== "success") return

  dispatch(setGrade(Streamed.loading()))

  const prompt = gradeSummaryPrompt({ story: story.val.story, summary: currentStory.summary })

  streamObj(prompt, GradeSchema, GradeSchema.partial(), (result) => {
    dispatch(setGrade(mapStreamedGrade(result)))
  })
}

function mapStreamedGrade(streamed: StreamedState<Grade, Partial<Grade>>): StreamedState<Grade> {
  switch (streamed.status) {
    case 'idle':
      return Streamed.idle();
    case 'loading': {
      const grade: Grade = {
        letter: 'C',
        reason: '',
        ...streamed.partial
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