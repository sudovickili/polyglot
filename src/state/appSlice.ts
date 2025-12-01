import { getOrCreateWordStats, ProgressSchema, updateHint, updateProgressForCompletedStory } from '@/progress/Progress'
import { STORY_0 } from '@/story/curatedStories'
import { HintSchema, ParsedWord, Story, StoryId, StoryIdSchema, StorySchema } from '@/story/Story'
import { parseStory } from '@/story/parseStory'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import z from 'zod'
import { ParsedStory, ParsedStorySchema } from '@/story/ParsedStory'
import { Grade } from '@/grade/Grade'
import { StoryEvalSchema } from '@/story/StoryEval'
import { LanguageSettingsSchema } from '@/app/LanguageSettings'
import { Streamed, StreamedState, StreamedStateSchema } from '@/util/StreamedState'

const NavSchema = z.literal(['Home', 'Progress', 'History'])
export type Nav = z.infer<typeof NavSchema>

export const ApiSecretsSchema = z.object({
  orgId: z.string(),
  apiKey: z.string(),
})
export const SecretsSchema = z.object({
  editing: z.boolean(),
  openai: ApiSecretsSchema,
})

export const AppStateSchema = z.object({
  progress: ProgressSchema,
  hint: HintSchema.optional(),
  currentStory: StoryEvalSchema,
  storiesById: z.record(StoryIdSchema, StreamedStateSchema(ParsedStorySchema, ParsedStorySchema)),
  language: LanguageSettingsSchema,
  nav: NavSchema,
  pastStories: z.array(StoryEvalSchema),
  secrets: SecretsSchema,
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
    [STORY_0.id]: Streamed.success(initialStory)
  },
  language: {
    learning: 'zh-simplified',
    native: 'en'
  },
  nav: 'Home',
  pastStories: [],
  secrets: {
    editing: true,
    openai: {
      orgId: '',
      apiKey: '',
    }
  }
}

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<Nav>) => {
      state.nav = action.payload
    },
    nextStory: (state, action: PayloadAction<{ id: StoryId }>) => {
      const lastStory = state.storiesById[state.currentStory.storyId]
      if (lastStory.status === 'success') {
        const allWords = lastStory.val.parsedAll.map(pw => pw.word)
        updateProgressForCompletedStory(state.progress, allWords)
      }

      delete state.hint
      const { id } = action.payload
      state.storiesById[id] = Streamed.idle()
      state.pastStories.push(state.currentStory)
      state.currentStory = {
        storyId: id,
        summary: ''
      }
    },
    setStory: (state, action: PayloadAction<{ id: StoryId, story: StreamedState<ParsedStory> }>) => {
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
    setGrade: (state, action: PayloadAction<StreamedState<Grade>>) => {
      state.currentStory.grade = action.payload
    },
    retryStory: (state) => {
      delete state.currentStory.grade
    },
    setSummary: (state, action: PayloadAction<string>) => {
      state.currentStory.summary = action.payload
    },
    setOpenAiSecrets: (state, action: PayloadAction<z.infer<typeof ApiSecretsSchema>>) => {
      state.secrets.openai = action.payload
    },
    setEditingSecrets: (state, action: PayloadAction<boolean>) => {
      state.secrets.editing = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  navigate,
  nextStory,
  setStory,
  hint,
  clearHint,
  setGrade,
  retryStory,
  setSummary,
  setOpenAiSecrets,
  setEditingSecrets
} = appSlice.actions

export default appSlice.reducer
