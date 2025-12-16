import { cn } from "@/lib/utils"
import { useAppState, useCurrentStory } from "@/state/hooks"
import { WordStatusStats } from "./WordStatusStats"
import { WordFrequencyStats } from "./WordFrequencyStats"
import { preferredWordsByBucket } from "@/progress/preferredWordsByBucket"
import { WordOverview } from "./WordOverview"
import { DebugHintToSeen } from "./DebugHintToSeen"
import { DebugPreferredBuckets } from "./DebugPreferredBuckets"

export function DebugView() {
  const app = useAppState((s) => s)

  const preferredWords = preferredWordsByBucket(app)
  const storyWords = useCurrentStory((s) =>
    s.status === "success" ? s.val.parsedAll.map((w) => w.word) : []
  )
  const storySet = new Set(storyWords)

  const statsClassName = "bg-neutral-800 rounded p-2 -mx-2 max-w-150"

  return (
    <div
      className={cn(
        "w-full h-full overflow-y-scroll overflow-x-hidden",
        "flex flex-col gap-4 p-4"
      )}
    >
      <h2 className="text-2xl">Debug View</h2>

      <DebugHintToSeen className={statsClassName} />
      <WordOverview className={statsClassName} />
      <WordStatusStats className={statsClassName} />
      <WordFrequencyStats className={statsClassName} />
      <h3 className="-mb-2">
        Preferred <span className="opacity-50">{`(as sent to llm)`}</span>
      </h3>
      <div className="flex flex-wrap">
        {preferredWords.map((w) => {
          return (
            <p
              key={w}
              className={cn(
                storySet.has(w) ? "text-amber-200" : "opacity-50",
                "mr-2"
              )}
            >
              {w}
            </p>
          )
        })}
      </div>
      <DebugPreferredBuckets className={statsClassName} />
    </div>
  )
}
