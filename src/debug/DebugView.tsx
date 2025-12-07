import { cn } from "@/lib/utils"
import { useAppState, useCurrentStory } from "@/state/hooks"
import { WordStatusStats } from "./WordStatusStats"
import { WordFrequencyStats } from "./WordFrequencyStats"
import { preferredWordsByBucket } from "@/progress/preferredWordsByBucket"
import { WordOverview } from "./WordOverview"
import {
  hintToSeenRatio_recent,
  RECENT_STORIES_THRESHOLD,
} from "@/progress/hintToSeenRatio"
import { useDisplayWord } from "@/dictionary/useDisplayWord"

export function DebugView() {
  const hsRatio = useAppState((s) => hintToSeenRatio_recent(s))
  const app = useAppState((s) => s)
  const toDisplay = useDisplayWord()

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
      <Item
        text={`Hint / Seen Ratio (last ${RECENT_STORIES_THRESHOLD} stories):`}
        value={hsRatio.toFixed(2)}
      />
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
              {toDisplay(w)}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function Item({ text, value }: { text: string; value: string | number }) {
  return (
    <div className="flex flex-wrap gap-2">
      <p className="opacity-60">{text}</p>
      <p className="bg-black font-mono px-1 text-amber-200">{value}</p>
    </div>
  )
}
