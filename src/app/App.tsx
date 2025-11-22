import { ProgressView } from "../progress/ProgressView"
import { useAppDispatch, useAppState } from "../state/hooks"
import { StoryView } from "../story/StoryView"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { GradeView } from "@/grade/GradeView"

function App() {
  const progress = useAppState((state) => state.progress)
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  return (
    <div
      className={cn(
        "w-screen h-screen bg-neutral-900 relative",
        "flex items-stretch"
      )}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-2 min-w-0 w-full flex flex-col border-r">
        {/* <TitleView className="p-4" /> */}
        <StoryView className="mt-4 p-4 flex-1 min-h-0 overflow-scroll" />
      </div>
      <ProgressView
        className="flex-1 min-w-0 p-4 bg-neutral-800"
        progress={progress}
      />
      <GradeView />
    </div>
  )
}

export default App
