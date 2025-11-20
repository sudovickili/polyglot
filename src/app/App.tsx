import { ProgressView } from "../progress/ProgressView"
import { useAppState, useDispatch } from "../state/hooks"
import { StoryView } from "../story/StoryView"
import cn from "classnames"
import { TitleView } from "./TitleView"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { GradeView } from "@/grade/GradeView"

function App() {
  const progress = useAppState((state) => state.progress)
  const dispatch = useDispatch()
  useKeyboardHandling()

  return (
    <div
      className={cn(
        "w-screen h-screen bg-neutral-950 relative",
        "flex items-stretch"
      )}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-2 min-w-0">
        <TitleView className="p-4" />
        <StoryView className="p-4" id={progress.currentStoryId} />
      </div>
      <ProgressView
        className="flex-1 min-w-0 p-4 bg-neutral-900"
        progress={progress}
      />
      <GradeView />
    </div>
  )
}

export default App
