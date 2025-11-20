import { cn } from "@/lib/utils"
import { knownWords, learningWords, Progress } from "./Progress"
import { computeLevel } from "./Level"
import { SummaryView } from "@/grade/SummaryView"

interface Props {
  className?: string
  progress: Progress
}

export function ProgressView({ className, progress }: Props) {
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-3xl">{level.level}</p>
      <div className="h-5" />
      <ProgressBar percent={level.progressToNext * 100} height="1rem" />
      <p className="opacity-50">{nKnownWords} known words</p>
      <div className="h-2" />
      <div>
        <p>Learning</p>
        <p className="text-sm opacity-50">
          {learningWords(progress)
            .map((w) => w.word)
            .join(", ")}
        </p>
        {/* <p>
          Known:{" "}
          {knownWords(progress)
            .map((w) => w.word)
            .join(", ")}
        </p> */}
      </div>

      <div className="flex-1" />
      <SummaryView />
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
