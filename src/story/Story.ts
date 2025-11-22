import z from "zod";

export const StoryIdSchema = z.string().brand("StoryId");
export type StoryId = z.infer<typeof StoryIdSchema>;
export function generateStoryId(): StoryId {
  return crypto.randomUUID() as StoryId;
}

export const StoryResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
})
export type StoryResponse = z.infer<typeof StoryResponseSchema>;

export const StorySchema = StoryResponseSchema.extend({
  id: StoryIdSchema,
})
export type Story = z.infer<typeof StorySchema>;

export const ParsedIdSchema = z.number().brand("parsedId");
export type ParsedId = z.infer<typeof ParsedIdSchema>;

export const ParsedWordSchema = z.object({
  parsedId: ParsedIdSchema,
  word: z.string().brand("Word"),
});
export type ParsedWord = z.infer<typeof ParsedWordSchema>;


export const HintSchema = z.object({
  word: ParsedWordSchema,
  level: z.number()
})
export type Hint = z.infer<typeof HintSchema>;