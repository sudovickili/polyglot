import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { computeLevel } from "@/progress/Level"
import { knownWords } from "@/progress/Progress"
import { nextStory, setGrade, setSummary } from "@/state/appSlice"
import { useAppState } from "@/state/hooks"
import { stories } from "@/story/stories"
import { useDispatch } from "react-redux"
import { gradeSummary } from "./gradeSummary"

export function SummaryView() {
  const dispatch = useDispatch()
  const progress = useAppState((state) => state.progress)
  const storyId = useAppState((state) => state.progress.currentStoryId)
  const story = stories[storyId]
  const summary = useAppState((state) => state.summary)

  async function gradeSummaryFlow() {
    dispatch(setGrade({ status: "loading" }))
    const grade = await gradeSummary({
      story,
      summary,
    })
    dispatch(setGrade({ status: "success", data: grade }))
  }

  return (
    <div>
      <Textarea
        placeholder="Summarize The Story"
        value={summary}
        onChange={(e) => dispatch(setSummary(e.target.value))}
      />
      <div className="h-2" />
      <Button size="lg" onClick={() => gradeSummaryFlow()}>
        Grade
      </Button>
    </div>
  )
}
