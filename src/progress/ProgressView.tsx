import { cn } from "@/lib/utils"
import { knownWords, Progress } from "./Progress"
import { Button } from "@/components/ui/button"
import { useAppState, useDispatch } from "@/state/hooks"
import { nextStory } from "@/state/appSlice"
import { Textarea } from "@/components/ui/textarea"
import { computeLevel } from "./Level"

interface Props {
  className?: string
  progress: Progress
}

export function ProgressView({ className, progress }: Props) {
  const dispatch = useDispatch()
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)

  const words = Object.entries(progress.wordsSeen)
  const lookedUp = words.filter(([, stats]) => stats.nHints > 0)
  const seen = words.filter(([, stats]) => stats.nSeen > 0)

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-3xl mb-5">{level.level}</p>
      <ProgressBar percent={level.progressToNext * 100} height="1rem" />
      <p className="opacity-50">{nKnownWords} known words</p>
      <div>
        <p>Looked Up: {lookedUp.map(([w]) => w).join(", ")}</p>
        <p>Seen: {seen.map(([w]) => w).join(", ")}</p>
      </div>

      <div className="flex-1" />
      <Textarea placeholder="Summarize The Story" />
      <Button size="lg" onClick={() => dispatch(nextStory())}>
        Grade
      </Button>
    </div>
  )
}

function ProgressBar({ percent, height }: { percent: number; height: string }) {
  return (
    <div className="bg-white/10 relative" style={{ height: height }}>
      <div
        className="bg-blue-500 absolute top-0 left-0 bottom-0"
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  )
}
