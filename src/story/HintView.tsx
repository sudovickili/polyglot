import { useAsync } from "@/util/hooks/useAsync"
import { useDispatch } from "react-redux"
import { dict } from "@/dictionary/Dictionary"
import { useAppState } from "@/state/hooks"
import { cn } from "@/lib/utils"
import { prettyPinyin } from "@/dictionary/chinese/prettyPinyin"
import { Char, Word } from "@/dictionary/Word"
import { ParsedWord } from "./Story"

export function HintView({ word }: { word: ParsedWord }) {
  const entry = useAsync(() => dict.define(word.word), [word])

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
        "rounded shadow-lg bg-blue-400 text-white p-2 max-w-90 relative"
      )}
    >
      {entry.status === "success" && entry.val && (
        <p>{entry.val.pinyin.map(prettyPinyin).join(" ")} </p>
      )}
      {hintLevel > 1 && (
        <>
          {entry.status === "success" && entry.val && (
            <p className="text-sm font-extralight">
              {entry.val.definitions.join(", ")}{" "}
            </p>
          )}
        </>
      )}
      {hintLevel > 2 && chars.length > 1 && (
        <>
          <div className="bg-white/20 w-full h-px my-2" />
          <div className="text-sm flex flex-col gap-1">
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
  const entry = useAsync(() => dict.define(char as Word), [char])
  return (
    <div className="flex gap-2 items-start">
      <span className="text-lg">{char}</span>
      {entry.status === "success" && (
        <span className="opacity-90 font-thin">
          {entry.val?.definitions.join(", ")}{" "}
        </span>
      )}
    </div>
  )
}
