import { useAsync } from "@/util/hooks/useAsync"
import { ParsedWord } from "./ParsedStory"
import { useDispatch } from "react-redux"
import { dict } from "@/dictionary/Dictionary"
import { useAppState } from "@/state/hooks"
import { cn } from "@/lib/utils"
import { prettyPinyin } from "@/dictionary/chinese/prettyPinyin"
import { Char, Word } from "@/dictionary/Word"

export function HintView({ word }: { word: ParsedWord }) {
  const entry = useAsync(() => dict.definitionLookup(word.word), [word])

  const hintLevel = useAppState((state) =>
    state.hint?.word?.parsedId === word.parsedId ? state.hint.level : 0
  )

  const dispatch = useDispatch()

  // const frequency = Hanzi.getFrequency(word)
  // if (!frequency) return null
  // const { ranking, definition } = frequency

  const chars = word.word.split("")

  return (
    <div
      className={cn(
        "rounded shadow-lg bg-blue-400 text-black p-2 max-w-90 relative"
      )}
    >
      {entry.status === "success" && entry.data && (
        <p>{entry.data.pinyin.map(prettyPinyin).join(" ")} </p>
      )}
      {hintLevel > 1 && (
        <>
          {entry.status === "success" && entry.data && (
            <p className="text-sm">{entry.data.definitions.join(", ")} </p>
          )}
        </>
      )}
      {hintLevel > 2 && (
        <>
          <div className="bg-black/20 w-full h-px my-2" />
          <div className="text-sm">
            {chars.map((char) => (
              <CharView key={char} char={char} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CharView({ char }: { char: string }) {
  const entry = useAsync(() => dict.definitionLookup(char as Word), [char])
  return (
    <p className="opacity-50">
      <span>{char}</span>
      {entry.status === "success" && (
        <span>{entry.data?.definitions.join(", ")} </span>
      )}
    </p>
  )
}
