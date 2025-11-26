import { generateText, generateObject, streamObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import z from "zod"
import { Err, Ok, Result } from "../Result"
import { Streamed, StreamedState } from "../StreamedState"

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID
})

export async function generate(prompt: string): Promise<Result<string>> {
  try {
    const { text } = await generateText({
      model: openai("gpt-5-nano"),
      prompt,
      temperature: 0, // Increase for more randomness
      maxOutputTokens: 16384, // This is the maximum number of tokens for gpt-4o-mini
      // frequencyPenalty: 0,
    })
    return Ok(text)
  } catch (e) {
    return Err(String(e))
  }
}

export async function generateObj<T>(prompt: string, schema: z.ZodSchema<T>): Promise<Result<T>> {
  try {
    const result = await generateObject({
      model: openai("gpt-5-nano"),
      prompt,
      temperature: 0, // Increase for more randomness
      maxTokens: 5000,
      schema,
    })
    return Ok(result.object)
  } catch (e) {
    return Err(String(e))
  }
}

export async function streamObj<T, T_Partial>(prompt: string, schema: z.ZodSchema<T>, partialSchema: z.ZodSchema<T_Partial>, onData: (data: StreamedState<T, T_Partial>) => void) {
  const { partialObjectStream, object } = streamObject({
    model: openai("gpt-5-nano"),
    prompt,
    temperature: 0, // Increase for more randomness
    maxTokens: 5000,
    schema,
  })

  try {
    for await (const partialObj of partialObjectStream) {
      const t_partial = partialSchema.parse(partialObj)
      onData(Streamed.loading(t_partial))
    }

    const t = await object as T
    onData(Streamed.success(t))
  } catch (e) {
    onData(Streamed.error(String(e)))
  }
}