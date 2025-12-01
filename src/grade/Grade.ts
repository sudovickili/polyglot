import { z } from "zod"

const GradeLetterSchema = z.literal(["A", "B", "C", "D", "F"]).describe(`
How well the user understands the story. "C" or above is considered passing. "D" or "F" will not pass, and the user will need to re-read the story and summarize again.
A: Excellent understanding
B: Good understanding
C: Satisfactory understanding
D: Some understanding, but with significant gaps
F: Poor or no understanding`)
export type GradeLetter = z.infer<typeof GradeLetterSchema>
export function isGradeLetter(s: any): s is GradeLetter {
  if (typeof s !== "string") return false
  return ["A", "B", "C", "D", "F"].includes(s)
}

export const GradeSchema = z.object({
  letter: GradeLetterSchema,
  reason: z.string().describe(`
The reasoning behind the given grade, without giving away details that would spoil the story for the user.`)
})

export type Grade = z.infer<typeof GradeSchema>

export function isPassingGrade(grade: GradeLetter): boolean {
  return ["A", "B", "C"].includes(grade)
}

export type StarCount = 0 | 1 | 2 | 3

export function gradeToStarCount(grade: GradeLetter): StarCount {
  switch (grade) {
    case "A":
      return 3
    case "B":
      return 2
    case "C":
      return 1
    default:
      return 0
  }
}

export function gradeToText(grade: GradeLetter): string {
  switch (grade) {
    case "A":
      return "Excellent"
    case "B":
      return "Good"
    case "C":
      return "Pass"
    case "D":
      return "So Close"
    case "F":
      return "Did you even try?"
  }
}