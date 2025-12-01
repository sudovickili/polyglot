import { useAppDispatch, useAppState } from "@/state/hooks"
import { WordProgressGroup } from "./ProgressOverview"
import {
  familiarWords,
  KNOWN_THRESHOLD,
  knownWords,
  learningWords,
  WordProgress,
} from "./Progress"
import { computeLevel, wordsToExceed } from "./Level"
import { useState } from "react"
import { ProgressBar } from "@/components/ProgressBar"

export function ProgressView() {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)
  const [selected, setSelected] = useState<WordProgress | null>(null)
  const dispatch = useAppDispatch()

  return (
    <div className="w-full h-full flex justify-center items-stretch">
      <div className="flex flex-col p-4 gap-4 overflow-scroll w-3xl">
        <div>
          <div className="flex gap-2 items-baseline">
            <p className="text-3xl">{level.level}</p>
            <p className="opacity-50">{`${nKnownWords} / ${wordsToExceed(
              level.level
            )} known words`}</p>
          </div>
        </div>
        <ProgressBar percent={level.progressToNext * 100} height="1rem" />
        <WordProgressGroup
          label="Learning"
          description="Recently hinted"
          words={learningWords(progress)}
          selected={selected}
          setSelected={setSelected}
        />
        <WordProgressGroup
          label="Known"
          description={`Seen ${KNOWN_THRESHOLD} times with no hints`}
          words={knownWords(progress)}
          selected={selected}
          setSelected={setSelected}
        />
        {/* <WordProgressGroup
          label="Familiar"
          description="Seen, but not known or learning"
          words={familiarWords(progress)}
          selected={selected}
          setSelected={setSelected}
        /> */}
      </div>
    </div>
  )
}
