import { cn } from "@/lib/utils"
import { knownWords, learningWords, WordProgress } from "./Progress"
import { computeLevel } from "./Level"
import { useAppDispatch, useAppState } from "@/state/hooks"
import { ProgressBar } from "@/components/ProgressBar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WordProgressView } from "./WordProgressView"
import { navigate } from "@/state/appSlice"

interface Props {
  className?: string
}

export function ProgressView({ className }: Props) {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)
  const dispatch = useAppDispatch()

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-center">
        <p className="text-3xl">{level.level}</p>
        <Button
          label="Deep Dive"
          variant="link"
          size="sm"
          onClick={() => dispatch(navigate("Progress"))}
        />
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
        {/* <p>
          Known:{" "}
          {knownWords(progress)
            .map((w) => w.word)
            .join(", ")}
        </p> */}
      </div>
    </div>
  )
}

export function WordProgressGroup({
  label,
  words,
  selected,
  setSelected,
}: {
  label: string
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
}) {
  return (
    <div>
      <div className="text-3xl mb-4">{label}</div>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {words.map((w) => {
          return (
            <WordProgressView
              key={w.word}
              wordProgress={w}
              selected={selected?.word === w.word}
              onMouseEnter={() => {
                setSelected(w)
              }}
              onMouseLeave={() => {
                setSelected(null)
              }}
              className="p-1 -m-1"
            />
          )
        })}
      </div>
    </div>
  )
}
