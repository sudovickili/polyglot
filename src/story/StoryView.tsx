import { Hanzi } from "../wordData/Hanzi"
import cn from "classnames"
import { prettyPinyin } from "../wordData/chinese/prettyPinyin"
import { useAsync } from "../util/hooks/useAsync"
import { Word } from "@/wordData/Word"

export function Story({ className }: { className?: string }) {
  const storyLines = story.split("\n").filter((line) => line.trim().length > 0)

  return (
    <div className={cn(className)}>
      {storyLines.map((line, index) => (
        <StoryLine key={index} line={line} />
      ))}
    </div>
  )
}

function StoryLine({ line }: { line: string }) {
  const words = Hanzi.segment(line)

  return (
    <div className="h-8">
      {words.map((word, index) => (
        <span
          key={index}
          className="group bg-neutral-900 text-white p-1 m-1 rounded relative text-xl"
        >
          {word}
          <Hint word={word} />
        </span>
      ))}
    </div>
  )
}

function Hint({ word }: { word: Word }) {
  const entry = useAsync(() => Hanzi.definitionLookup(word), [word])
  if (entry.status !== "success" || entry.data === undefined) {
    return null
  }

  const { pinyin, definitions, traditional } = entry.data

  // const frequency = Hanzi.getFrequency(word)
  // if (!frequency) return null
  // const { ranking, definition } = frequency

  return (
    <div
      className={cn(
        "absolute bottom-full left-0 hidden group-hover:block",
        "rounded shadow-lg bg-amber-200 text-black p-2 min-w-80 text-md"
      )}
    >
      <p>{pinyin.map(prettyPinyin).join(", ")}</p>
      <p>{definitions.join(", ")}</p>
    </div>
  )
}

const story = `小明的猫

我叫小明。
我有一只猫。
我的猫很小。
我的猫是白色的。

我的猫喜欢喝牛奶。
它也喜欢吃鱼。

今天，我的猫不见了。
我很不高兴。

我看看桌子下面。猫不在。
我看看床上面。猫不在。

我听见一个声音。“喵...”
我看看门后面。

猫在那里！
我很高兴。

我的小猫也很好。
我和我的猫都很高兴。`
