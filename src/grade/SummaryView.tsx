import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { setSummary } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  DEBUG_gradeSummarySuccess,
  gradeSummaryThunk,
} from "./gradeSummaryThunk"
import { DebugButton } from "@/components/debugButton"

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
      <div className="flex justify-between gap-2">
        <Button
          size="lg"
          onClick={() => {
            dispatch(gradeSummaryThunk())
          }}
        >
          Grade
        </Button>
        <DebugButton
          label="Grade (A)"
          onClick={() => {
            dispatch(DEBUG_gradeSummarySuccess())
          }}
        />
      </div>
    </div>
  )
}
