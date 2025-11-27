import { generateText, generateObject, streamObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import z from "zod"
import { Err, Ok, Result } from "../Result"
import { Streamed, StreamedState } from "../StreamedState"
import { Log } from "../Log"

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
    Log.error(`generate error`, e)
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
    Log.error(`generateObj error`, e)
    return Err(String(e))
  }
}

export async function streamObj<T, T_Partial>(prompt: string, schema: z.ZodSchema<T>, partialSchema: z.ZodSchema<T_Partial>, onData: (data: StreamedState<T, T_Partial>) => void) {
  try {
    const { partialObjectStream, object } = streamObject({
      model: openai("gpt-5-nano"),
      prompt,
      temperature: 0, // Increase for more randomness
      maxTokens: 5000,
      schema,
    })

    for await (const partialObj of partialObjectStream) {
      const t_partial = partialSchema.safeParse(partialObj)
      if (t_partial.success) {
        onData(Streamed.loading(t_partial.data))
      } else {
        Log.error(`streamObj error parsing partial ${JSON.stringify(partialObj, null, 2)}`, t_partial.error)
      }
    }

    const t = await object as T
    onData(Streamed.success(t))
  } catch (e) {
    Log.error(`streamObj error`, e)
    onData(Streamed.error(String(e)))
  }
}