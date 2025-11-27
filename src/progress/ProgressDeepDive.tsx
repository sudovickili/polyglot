import { useAppDispatch, useAppState } from "@/state/hooks"
import { WordProgressGroup } from "./ProgressView"
import {
  familiarWords,
  knownWords,
  learningWords,
  WordProgress,
} from "./Progress"
import { computeLevel } from "./Level"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ProgressBar"
import { navigate } from "@/state/appSlice"

export function ProgressDeepDive() {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)
  const [selected, setSelected] = useState<WordProgress | null>(null)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col p-4">
      <div className="flex justify-between items-center">
        <p className="text-3xl">{level.level}</p>
        <Button
          label="Back"
          variant="link"
          size="sm"
          onClick={() => dispatch(navigate("Home"))}
        />
      </div>
      <div className="h-5" />
      <ProgressBar percent={level.progressToNext * 100} height="1rem" />
      <WordProgressGroup
        label="Learning"
        words={learningWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
      <WordProgressGroup
        label="Known"
        words={knownWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
      <WordProgressGroup
        label="Familiar"
        words={familiarWords(progress)}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  )
}
