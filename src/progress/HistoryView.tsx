import { gradeToStarCount } from "@/grade/Grade"
import { StarsView } from "@/grade/StarsView"
import { useAppState } from "@/state/hooks"
import { StoryEval } from "@/story/StoryEval"
import { Log } from "@/util/Log"

export function HistoryView() {
  const pastStories = useAppState((s) => s.pastStories)

  return (
    <div className="w-full h-full flex flex-col items-center justify-end gap-4 p-4">
      {pastStories.map((story) => {
        {
          return <PastStoryView key={story.storyId} gradedStory={story} />
        }
      })}
    </div>
  )
}

function PastStoryView({ gradedStory }: { gradedStory: StoryEval }) {
  const maybeStory = useAppState((s) => s.storiesById[gradedStory.storyId])

  if (
    maybeStory.status !== "success" ||
    gradedStory.grade?.status !== "success"
  ) {
    Log.error("Incomplete past graded story found", gradedStory)
    return null
  }

  const story = maybeStory.val

  const starCount = gradeToStarCount(gradedStory.grade.val)

  return (
    <div className="bg-neutral-800 p-2 rounded-md">
      <h2 className="text-xl font-thin mb-2">{story.story.title}</h2>
      <StarsView stars={starCount} size="2rem" />
    </div>
  )
}
