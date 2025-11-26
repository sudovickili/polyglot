import { GradeSchema } from "@/grade/Grade";
import z from "zod";
import { StoryIdSchema } from "./Story";
import { StreamedStateSchema } from "@/util/StreamedState";

export const StoryEvalSchema = z.object({
  storyId: StoryIdSchema,
  summary: z.string(),
  grade: StreamedStateSchema(GradeSchema).optional(),
})
export type StoryEval = z.infer<typeof StoryEvalSchema>;