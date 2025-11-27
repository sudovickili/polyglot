import { ProgressView } from "../progress/ProgressView"
import { useAppDispatch, useAppState } from "../state/hooks"
import { StoryView } from "../story/StoryView"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { GradeView } from "@/grade/GradeView"
import { SummaryView } from "@/grade/SummaryView"
import { ProgressDeepDive } from "@/progress/ProgressDeepDive"

function App() {
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  const nav = useAppState((s) => s.nav)

  if (nav === "Progress") {
    return <ProgressDeepDive />
  }

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
      <div className="flex-1 flex flex-col p-4 bg-neutral-800">
        <ProgressView className="min-w-0" />
        <div className="flex-1" />
        <SummaryView />
      </div>

      <GradeView />
    </div>
  )
}

export default App
