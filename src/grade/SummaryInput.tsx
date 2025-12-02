import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { setSummary } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  DEBUG_gradeSummarySuccess,
  gradeSummaryThunk,
} from "./gradeSummaryThunk"
import { AArrowUp, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function SummaryInput({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const { summary } = useAppState((s) => s.currentStory)

  return (
    <div
      className={cn(
        "rounded-[24px] overflow-hidden",
        "flex items-end gap-1 p-1",
        className
      )}
    >
      <Textarea
        placeholder="Summarize The Story"
        value={summary}
        onChange={(e) => dispatch(setSummary(e.target.value))}
        className="border-none resize-none"
        rows={1}
        onInput={(e) => {
          const el = e.currentTarget
          el.style.height = "auto"
          el.style.height = `${el.scrollHeight}px`
        }}
      />
      <Button
        size="lg"
        onClick={() => {
          dispatch(gradeSummaryThunk())
        }}
        icon={<ArrowUp />}
        className="w-9 h-9 m-0.5 rounded-full"
        disabled={summary.trim().length === 0}
      />
      <Button
        variant="debug"
        icon={<AArrowUp />}
        onClick={() => {
          dispatch(DEBUG_gradeSummarySuccess())
        }}
        className="w-9 h-9 m-0.5 rounded-full"
      />
    </div>
  )
}
