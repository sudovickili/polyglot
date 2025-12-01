import { GradeLetter } from "@/grade/Grade"
import { StarsView } from "@/grade/StarsView"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/hooks"
import { StoryEval } from "@/story/StoryEval"
import { Log } from "@/util/Log"

export function HistoryView() {
  const pastStories = useAppState((s) => s.pastStories)

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 p-4 overflow-scroll">
      <CurrentStoryView />
      {pastStories
        .map((story, idx) => {
          {
            return (
              <PastStoryView
                key={story.storyId}
                gradedStory={story}
                idx={idx}
              />
            )
          }
        })
        .reverse()}
    </div>
  )
}

function CurrentStoryView() {
  const title = useAppState((s) => {
    const storyId = s.currentStory.storyId
    const story = s.storiesById[storyId]
    if (story.status === "success") {
      return story.val.story.title
    } else {
      return "Loading..."
    }
  })

  const idx = useAppState((s) => s.pastStories.length)

  return (
    <HistoryItemView
      title={title}
      isActive={true}
      date="Current"
      onClick={() => {}}
      idx={idx}
    />
  )
}

function PastStoryView({
  gradedStory,
  idx,
}: {
  gradedStory: StoryEval
  idx: number
}) {
  const maybeStory = useAppState((s) => s.storiesById[gradedStory.storyId])

  if (
    maybeStory.status !== "success" ||
    gradedStory.grade?.status !== "success"
  ) {
    Log.error("Incomplete past graded story found", gradedStory)
    return null
  }

  const story = maybeStory.val

  return (
    <HistoryItemView
      title={story.story.title}
      grade={gradedStory.grade.val.letter}
      isActive={false}
      onClick={() => {}}
      date=""
      idx={idx}
    />
  )
}

interface HistoryItemProps {
  title: string
  grade?: GradeLetter
  isActive: boolean
  date: string
  onClick: () => void
  idx: number
}

function HistoryItemView({
  title,
  grade,
  date,
  isActive,
  onClick,
  idx,
}: HistoryItemProps) {
  return (
    <div
      className={cn(
        "bg-neutral-800 p-4 rounded-md w-full max-w-3xl",
        "flex items-center gap-4",
        isActive && "border-2 border-white"
      )}
    >
      <h3 className="text-xl font-thin">{`${idx + 1}. ${title}`}</h3>
      <p className="text-sm opacity-50">{date}</p>
      <div className="flex-1" />
      {grade && <StarsView grade={grade} size="1.5rem" />}
    </div>
  )
}
