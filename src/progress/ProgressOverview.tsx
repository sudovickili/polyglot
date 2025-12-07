import { cn } from "@/lib/utils"
import { knownWords, learningWords } from "./Progress"
import { computeLevel } from "./Level"
import { useAppState } from "@/state/hooks"
import { ProgressBar } from "@/components/ProgressBar"
import { useDisplayWord } from "@/dictionary/useDisplayWord"

interface Props {
  className?: string
}

export function ProgressOverview({ className }: Props) {
  const progress = useAppState((s) => s.progress)
  const toDisplay = useDisplayWord()
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-center">
        <p className="text-3xl">{level.level}</p>
      </div>
      <div className="h-5" />
      <ProgressBar percent={level.progressToNext * 100} className="min-h-4" />
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
            .map((w) => toDisplay(w.word))
            .join(", ")}
        </p>
      </div>
    </div>
  )
}
