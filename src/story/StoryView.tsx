import { NOT_WORDS } from "@/dictionary/notWords"
import { ParsedWord } from "./Story"
import { SimpleWordView, WordView } from "./WordView"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/hooks"
import { StreamedState } from "@/util/StreamedState"
import { ParsedStory } from "./ParsedStory"

interface Props {
  className?: string
}

export function StoryView({ className }: Props) {
  const storyId = useAppState((state) => state.currentStory.storyId)
  const story = useAppState((state) => state.storiesById[storyId])

  if (!story) return null

  return (
    <div
      className={cn(className, "select-none flex flex-col gap-0 text-white/80")}
    >
      <StreamedStoryView story={story} />
    </div>
  )
}

function StreamedStoryView({ story }: { story: StreamedState<ParsedStory> }) {
  switch (story.status) {
    case "idle":
      return <div className="italic">Loading story...</div>
    case "loading":
      if (story.partial) {
        return <ParsedStoryView story={story.partial} />
      } else {
        return <div className="italic">Loading story...</div>
      }
    case "success":
      return <ParsedStoryView story={story.val} />
    case "error":
      return <div>Error Loading Story: {story.err}</div>
  }
}

function ParsedStoryView({ story }: { story: ParsedStory }) {
  const { parsedTitle, parsedContent } = story

  return (
    <>
      <StoryLine line={parsedTitle} className={"mb-4 text-3xl"} />
      {parsedContent.map((line, index) => (
        <StoryLine key={index} line={line} />
      ))}
    </>
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
