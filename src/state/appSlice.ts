import { Progress, ProgressSchema, updateHint, updateSeen, WordStats } from '@/progress/Progress'
import { stories, nextStoryId } from '@/story/stories'
import { HintSchema } from '@/story/Story'
import { parseStory } from '@/story/parseStory'
import { Word, WordSchema } from '@/dictionary/Word'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import z, { set } from 'zod'
import { ParsedWord } from '@/story/ParsedStory'
import { Grade, GradeSchema } from '@/grade/Grade'
import { AsyncState, AsyncStateSchema } from '@/util/AsyncState'

export const AppStateSchema = z.object({
  progress: ProgressSchema,
  hint: HintSchema.optional(),
  summary: z.string(),
  grade: AsyncStateSchema(GradeSchema).optional()
})

export type AppState = z.infer<typeof AppStateSchema>

export const initialState: AppState = {
  progress: {
    currentStoryId: stories[0].id,
    wordsSeen: {}
  },
  summary: '',
}

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    nextStory: (state) => {
      delete state.grade
      state.summary = ''
      const story = stories.find((story) => story.id === state.progress.currentStoryId)!;

      parseStory(story).parsedAll.forEach(word => {
        const stats = getOrCreateWordStats(state.progress.wordsSeen, word.word)
        updateSeen(stats)
      })

      state.progress.currentStoryId = nextStoryId(state.progress.currentStoryId)
    },
    hint: (state, action: PayloadAction<{ word: ParsedWord, level: number }>) => {
      const hint = action.payload

      state.hint = action.payload
      const stats = getOrCreateWordStats(state.progress.wordsSeen, hint.word.word)
      updateHint(stats)
    },
    clearHint: (state) => {
      state.hint = undefined
    },
    setGrade: (state, action: PayloadAction<AsyncState<Grade>>) => {
      state.grade = action.payload
    },
    retryStory: (state) => {
      delete state.grade
    },
    setSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload
    }
  },
})

function getOrCreateWordStats(wordsSeen: Record<Word, WordStats>, word: Word): WordStats {
  if (!wordsSeen[word]) {
    wordsSeen[word] = {
      word,
      nSeen: 0,
      nHints: 0,
      nSeenSinceLastHint: 0
    }
  }
  return wordsSeen[word]
}

// Action creators are generated for each case reducer function
export const {
  nextStory,
  hint,
  clearHint,
  setGrade,
  retryStory,
  setSummary
} = appSlice.actions

export default appSlice.reducer