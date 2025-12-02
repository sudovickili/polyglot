import { cn } from "@/lib/utils"
import { knownWords, learningWords } from "./Progress"
import { computeLevel } from "./Level"
import { useAppDispatch, useAppState } from "@/state/hooks"
import { ProgressBar } from "@/components/ProgressBar"

interface Props {
  className?: string
}

export function ProgressOverview({ className }: Props) {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-center">
        <p className="text-3xl">{level.level}</p>
      </div>
      <div className="h-5" />
      <ProgressBar percent={level.progressToNext * 100} height="1rem" />
      <p className="opacity-50">{nKnownWords} known words</p>
      <div className="h-2" />
      <div>
        <p>
          Learning{" "}
          <span className="text-sm opacity-50">
            ({learningWords(progress).length})
          </span>
        </p>
        <p className="text-sm opacity-50">
          {learningWords(progress)
            .map((w) => w.word)
            .join(", ")}
        </p>
      </div>
    </div>
  )
}
