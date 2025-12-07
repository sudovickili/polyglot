import { useAppDispatch, useAppState } from "@/state/hooks"
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
import { WordProgressGroup } from "./WordProgressGroup"
import { Button } from "@/components/ui/button"
import { resetState } from "@/state/store"
import { wrapClick } from "@/util/wrapClick"
import { dict } from "@/dictionary/Dictionary"
import { Word } from "@/dictionary/Word"

export function ProgressView() {
  const progress = useAppState((s) => s.progress)
  const nKnownWords = knownWords(progress).length
  const level = computeLevel(nKnownWords)
  const [selected, setSelected] = useState<WordProgress | null>(null)
  const dispatch = useAppDispatch()

  return (
    <div
      className="w-full h-full flex justify-center items-stretch"
      onClick={wrapClick(() => setSelected(null))}
    >
      <div className="flex flex-col p-4 gap-4 overflow-y-scroll overflow-x-hidden w-3xl">
        <div>
          <div className="flex gap-2 items-baseline">
            <p className="text-3xl">{level.level}</p>
            <p className="opacity-50">{`${nKnownWords} / ${wordsToExceed(
              level.level
            )} known words`}</p>
            <div className="grow" />
            <Button
              variant="debug"
              label="Reset State"
              size="sm"
              onClick={() => {
                dispatch(resetState())
              }}
            />
          </div>
        </div>
        <ProgressBar percent={level.progressToNext * 100} className="min-h-4" />
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
        <WordProgressGroup
          label="Familiar"
          description="Seen, but not known or learning"
          words={familiarWords(progress)}
          selected={selected}
          setSelected={setSelected}
          collapsedOnRender={true}
        />
        <WordProgressGroup
          label="Remaining"
          description=""
          words={dict
            .allUnique()
            .filter((w) => {
              const word = w.simplified as Word
              const wp = progress.wordsSeen[word]
              return wp === undefined
            })
            .map((w) => ({
              word: w.simplified as Word,
              nSeen: 0,
              nHints: 0,
            }))}
          selected={selected}
          setSelected={setSelected}
          collapsedOnRender={true}
        />
      </div>
    </div>
  )
}
