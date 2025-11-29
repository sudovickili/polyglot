import { useAppDispatch, useAppState } from "@/state/hooks"
import { WordProgressGroup } from "./ProgressOverview"
import {
  familiarWords,
  knownWords,
  learningWords,
  WordProgress,
} from "./Progress"
import { computeLevel } from "./Level"
import { useState } from "react"
import { ProgressBar } from "@/components/ProgressBar"

export function ProgressView() {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)
  const [selected, setSelected] = useState<WordProgress | null>(null)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col p-4 gap-4">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-3xl">{level.level}</p>
        </div>
      </div>
      <ProgressBar percent={level.progressToNext * 100} height="1rem" />
      <WordProgressGroup
        label="Learning"
        description="Recently looked up"
        words={learningWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
      <WordProgressGroup
        label="Known"
        description="Seen several times with no hints"
        words={knownWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
      <WordProgressGroup
        label="Familiar"
        description="Seen, but not known or learning"
        words={familiarWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  )
}
