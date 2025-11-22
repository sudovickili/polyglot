import { Ok } from "@/util/Result";
import { generateStoryId } from "./Story";
import { createStory } from "./createStory";
import { nextStory, setStory } from "@/state/appSlice";
import { Async } from "@/util/AsyncState";
import { nextStoryId, curatedStories } from "./curatedStories";
import { parseStory } from "./parseStory";
import { AppThunk } from "@/state/store";

export const createStoryThunk = (): AppThunk => async (dispatch, getState) => {
  const nextCuratedStoryId = nextStoryId(
    getState().app.currentStory.storyId
  );

  const id = nextCuratedStoryId ?? generateStoryId();

  dispatch(nextStory({ id }))

  const progress = getState().app.progress;

  const curated = curatedStories.find((s) => s.id === nextCuratedStoryId)
  const result = curated ? Ok(curated) : (await createStory({ progress }));

  if (result.ok) {
    const story = await parseStory({
      ...result.val, id
    })
    dispatch(setStory({ id, story: Async.success(story) }));
  } else {
    dispatch(setStory({ id, story: Async.error(result.err) }));
  }
}