import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { setSummary } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import { gradeSummaryThunk } from "./gradeSummaryThunk"

export function SummaryView() {
  const dispatch = useAppDispatch()
  const { summary } = useAppState((s) => s.currentStory)

  return (
    <div>
      <Textarea
        placeholder="Summarize The Story"
        value={summary}
        onChange={(e) => dispatch(setSummary(e.target.value))}
      />
      <div className="h-2" />
      <Button
        size="lg"
        onClick={() => {
          dispatch(gradeSummaryThunk())
        }}
      >
        Grade
      </Button>
    </div>
  )
}
