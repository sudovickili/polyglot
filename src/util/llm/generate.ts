import { generateText, generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import z from "zod"

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID
})

export async function generate(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-5-nano"),
    prompt,
    temperature: 0, // Increase for more randomness
    maxOutputTokens: 16384, // This is the maximum number of tokens for gpt-4o-mini
    // frequencyPenalty: 0,
  })

  return text
}

export async function generateObj<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt,
    temperature: 0, // Increase for more randomness
    maxTokens: 16384, // This is the maximum number of tokens for gpt-4o-mini
    schema,
  })
  return result.object
}