import { configureStore, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import appReducer, { AppStateSchema, initialState } from './appSlice'
import { SaveManager } from '@/util/SaveManager'

const saveManager = new SaveManager({
  debounce_s: 3,
  maxWait_s: 20
}, {
  PersistedAppState2: AppStateSchema
})

const loadedStateResult = saveManager.load('PersistedAppState2')
const loadedState = loadedStateResult.ok ? loadedStateResult.val : null
if (!loadedStateResult.ok) {
  console.warn('Failed to load persisted state:', loadedStateResult.err.message)
}

export const store = configureStore({
  reducer: {
    app: appReducer
  },
  preloadedState: {
    // app: initialState,
    app: loadedState ? { ...initialState, ...loadedState } : initialState
  },
})

store.subscribe(() => {
  const persistedState = {
    ...store.getState().app,
    activeSession: undefined // Don't persist the active session
  }

  saveManager.stateUpdated('PersistedAppState2', persistedState)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Generic thunk type (lets you specify the return type if needed)
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>