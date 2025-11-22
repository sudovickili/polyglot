import { useDispatch, useSelector } from "react-redux"
import { AppState } from "./appSlice"
import { AppDispatch, RootState } from "./store"

export function useAppState<T>(cb: (state: AppState) => T) {
  return useSelector((state: RootState) => cb(state.app))
}
export const useAppDispatch = () => useDispatch<AppDispatch>();