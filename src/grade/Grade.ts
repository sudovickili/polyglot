import { z } from "zod"

const GradeLetterSchema = z.literal(["A", "B", "C", "D", "F"]).describe(`
How well the user understands the story. "C" or above is considered passing. "D" or "F" will not pass, and the user will need to re-read the story and summarize again.
A: Excellent understanding
B: Good understanding
C: Satisfactory understanding
D: Some understanding, but with significant gaps
F: Poor or no understanding`)
export type GradeLetter = z.infer<typeof GradeLetterSchema>

export const GradeSchema = z.object({
  letter: GradeLetterSchema,
  reason: z.string().describe(`
The reasoning behind the given grade, without giving away details that would spoil the story for the user.`)
})

export type Grade = z.infer<typeof GradeSchema>

export function isPassingGrade(grade: Grade): boolean {
  return ["A", "B", "C"].includes(grade.letter)
}