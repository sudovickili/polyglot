import { generateStoryId, StoryId, StoryResponse, StoryResponseSchema } from "./Story";
import { createStoryPrompt } from "./createStory";
import { nextStory, setStory } from "@/state/appSlice";
import { nextStoryId, curatedStories } from "./curatedStories";
import { parseStory } from "./parseStory";
import { AppThunk } from "@/state/store";
import { ParsedStory } from "./ParsedStory";
import { streamObj } from "@/util/llm/generate";
import { Streamed, StreamedState } from "@/util/StreamedState";
import { Log } from "@/util/Log";

export const createStoryThunk = (): AppThunk => async (dispatch, getState) => {
  const curated = await getNextCuratedStory(getState().app.currentStory.storyId);

  if (curated) {
    dispatch(nextStory({ id: curated.story.id }));
    dispatch(setStory({ id: curated.story.id, story: Streamed.success(curated) }));
    return;
  }

  const id: StoryId = generateStoryId();
  dispatch(nextStory({ id }))
  dispatch(setStory({ id, story: Streamed.loading() }))

  const prompt = createStoryPrompt(getState().app.progress);
  Log.info("createStory prompt", prompt)
  streamObj({
    prompt,
    model: 'gpt-4.1-nano'
  }, StoryResponseSchema, StoryResponseSchema.partial(), async (streamed) => {
    const streamedParsed = await streamedStoryToParsed(streamed);
    dispatch(setStory({ id, story: streamedParsed }));
  })
}

async function streamedStoryToParsed(streamed: StreamedState<StoryResponse, Partial<StoryResponse>>): Promise<StreamedState<ParsedStory>> {
  switch (streamed.status) {
    case 'idle':
      return Streamed.idle();
    case 'loading': {
      const storyResponse: StoryResponse = {
        title: '',
        content: '',
        ...streamed.partial
      };
      const parsed = await parseStory({
        ...storyResponse,
        id: generateStoryId()
      });
      return Streamed.loading(parsed);
    }
    case 'success': {
      const parsed = await parseStory({
        ...streamed.val,
        id: generateStoryId()
      });
      return Streamed.success(parsed);
    }
    case 'error':
      return Streamed.error(streamed.err);
  }
}

async function getNextCuratedStory(currentStoryId: StoryId): Promise<ParsedStory | undefined> {
  const nextCuratedStoryId = nextStoryId(
    currentStoryId
  );

  if (!nextCuratedStoryId) return

  const curated = curatedStories.find((s) => s.id === nextCuratedStoryId);

  if (!curated) return

  return await parseStory({
    ...curated, id: nextCuratedStoryId
  });
}