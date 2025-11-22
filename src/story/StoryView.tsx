import { NOT_WORDS } from "@/dictionary/notWords"
import { ParsedWord } from "./Story"
import { SimpleWordView, WordView } from "./WordView"
import { parseStory } from "./parseStory"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/hooks"

interface Props {
  className?: string
}

export function StoryView({ className }: Props) {
  const storyId = useAppState((state) => state.currentStory.storyId)
  const story = useAppState((state) => state.storiesById[storyId])

  if (!story) return null

  if (story.status === "loading" || story.status === "idle") {
    return <div className={cn(className, "italic")}>Loading story...</div>
  }

  if (story.status === "error") {
    return <div className={cn(className)}>Error Loading Story: {story.err}</div>
  }

  const { parsedTitle, parsedContent } = story.val

  return (
    <div
      className={cn(className, "select-none flex flex-col gap-0 text-white/80")}
    >
      <StoryLine line={parsedTitle} className={"mb-4 text-3xl"} />
      {parsedContent.map((line, index) => (
        <StoryLine key={index} line={line} />
      ))}
    </div>
  )
}

function StoryLine({
  line,
  className,
}: {
  line: ParsedWord[]
  className?: string
}) {
  return (
    <div className={cn("text-xl flex flex-wrap", className)}>
      {line.map((word) => {
        return NOT_WORDS.has(word.word) ? (
          <SimpleWordView key={word.parsedId} word={word.word} />
        ) : (
          <WordView key={word.parsedId} word={word} />
        )
      })}
    </div>
  )
}
