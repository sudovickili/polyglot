import { combineReducers, configureStore, PayloadAction, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import appReducer, { AppStateSchema, cleanupAppState, initialState } from './appSlice'
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
} else {
  loadedStateResult.val = cleanupAppState(loadedStateResult.val)
}

const baseReducer = combineReducers({
  app: appReducer
})

const RESET_STATE = 'reset-state'
export function resetState(): PayloadAction {
  return {
    type: RESET_STATE,
    payload: undefined
  }
}

function rootReducer(state: ReturnType<typeof baseReducer> | undefined, action: UnknownAction): ReturnType<typeof baseReducer> {
  if (state === undefined) {
    return baseReducer(state, action)
  }
  if (action.type === RESET_STATE) {
    return {
      app: initialState
    }
  }
  return baseReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    // app: initialState,
    app: loadedState ? { ...initialState, ...loadedState } : initialState
  },
})

store.subscribe(() => {
  const persistedState = {
    ...store.getState().app,
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