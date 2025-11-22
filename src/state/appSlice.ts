import { getOrCreateWordStats, ProgressSchema, updateHint, updateProgressForCompletedStory } from '@/progress/Progress'
import { STORY_0 } from '@/story/curatedStories'
import { HintSchema, ParsedWord, Story, StoryId, StoryIdSchema, StorySchema } from '@/story/Story'
import { parseStory } from '@/story/parseStory'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import z from 'zod'
import { ParsedStory, ParsedStorySchema } from '@/story/ParsedStory'
import { Grade } from '@/grade/Grade'
import { Async, AsyncState, AsyncStateSchema } from '@/util/AsyncState'
import { StoryEvalSchema } from '@/story/StoryEval'

export const AppStateSchema = z.object({
  progress: ProgressSchema,
  hint: HintSchema.optional(),
  currentStory: StoryEvalSchema,
  storiesById: z.record(StoryIdSchema, AsyncStateSchema(ParsedStorySchema))
})

export type AppState = z.infer<typeof AppStateSchema>

const initialStory = await parseStory(STORY_0)

export const initialState: AppState = {
  progress: {
    wordsSeen: {}
  },
  currentStory: {
    storyId: STORY_0.id,
    summary: '',
  },
  storiesById: {
    [STORY_0.id]: Async.success(initialStory)
  }
}

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    nextStory: (state, action: PayloadAction<{ id: StoryId }>) => {
      const lastStory = state.storiesById[state.currentStory.storyId]
      if (lastStory.status === 'success') {
        const allWords = lastStory.val.parsedAll.map(pw => pw.word)
        updateProgressForCompletedStory(state.progress, allWords)
      }

      delete state.hint
      const { id } = action.payload
      state.storiesById[id] = Async.idle()
      state.currentStory = {
        storyId: id,
        summary: ''
      }
    },
    setStory: (state, action: PayloadAction<{ id: StoryId, story: AsyncState<ParsedStory> }>) => {
      const { id, story } = action.payload
      state.storiesById[id] = story
    },
    hint: (state, action: PayloadAction<{ word: ParsedWord, level: number }>) => {
      const hint = action.payload

      state.hint = action.payload
      const stats = getOrCreateWordStats(state.progress.wordsSeen, hint.word.word)
      updateHint(stats)
    },
    clearHint: (state) => {
      delete state.hint
    },
    setGrade: (state, action: PayloadAction<AsyncState<Grade>>) => {
      state.currentStory.grade = action.payload
    },
    retryStory: (state) => {
      delete state.currentStory.grade
    },
    setSummary: (state, action: PayloadAction<string>) => {
      state.currentStory.summary = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  nextStory,
  setStory,
  hint,
  clearHint,
  setGrade,
  retryStory,
  setSummary
} = appSlice.actions

export default appSlice.reducer
