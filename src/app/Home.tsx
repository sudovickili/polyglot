import { GradeView } from "@/grade/GradeView"
import { SummaryView } from "@/grade/SummaryView"
import { cn } from "@/lib/utils"
import { ProgressOverview } from "@/progress/ProgressOverview"
import { clearHint } from "@/state/appSlice"
import { StoryView } from "@/story/StoryView"
import { wrapClick } from "@/util/wrapClick"
import { useDispatch } from "react-redux"

export function Home() {
  const dispatch = useDispatch()
  return (
    <div
      className={cn("w-full h-full relative", "flex items-stretch")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-2 min-w-0 border-r flex justify-center">
        {/* <TitleView className="p-4" /> */}
        <div className="w-190 h-full min-h-0 flex flex-col">
          <StoryView className="w-full p-4 pb-8 min-h-0 overflow-scroll flex-1" />
          <div className="z-10 p-4 pt-0 -mt-6 w-full">
            <SummaryView className="bg-neutral-700" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-4 bg-neutral-800 max-md:hidden">
        <ProgressOverview className="min-w-0" />
      </div>
      <GradeView className="absolute inset-0 bg-black/50 z-40" />
    </div>
  )
}
