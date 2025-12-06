import { ParsedStory } from "@/story/ParsedStory";
import { AppState } from "./appSlice";
import { StoryEval } from "@/story/StoryEval";

/** New stories are pushed to the end of the pastStories array */
export function getMostRecentStoryEvals(app: AppState, n: number): StoryEval[] {
  return app.pastStories.slice(-n)
}

export function getMostRecentParsedStories(app: AppState, n: number): ParsedStory[] {
  return app.pastStories
    .map(s => app.storiesById[s.storyId])
    .filter(s => s.status === 'success')
    .slice(-n)
    .map(s => s.val)
}