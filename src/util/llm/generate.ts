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

interface Options {
  model: Parameters<typeof openai>[0],
  prompt: string,
  temperature?: number,
  maxOutputTokens?: number,
}

export async function generate(options: Options): Promise<Result<string>> {
  try {
    const { text } = await generateText({
      ...options,
      model: openai(options.model)
    })
    return Ok(text)
  } catch (e) {
    Log.error(`generate error`, e)
    return Err(String(e))
  }
}

export async function generateObj<T>(options: Options, schema: z.ZodSchema<T>): Promise<Result<T>> {
  try {
    const result = await generateObject({
      ...options,
      model: openai(options.model),
      schema
    })
    return Ok(result.object)
  } catch (e) {
    Log.error(`generateObj error`, e)
    return Err(String(e))
  }
}

export async function streamObj<T, T_Partial>(options: Options, schema: z.ZodSchema<T>, partialSchema: z.ZodSchema<T_Partial>, onData: (data: StreamedState<T, T_Partial>) => void) {
  try {
    const { partialObjectStream, object } = streamObject({
      ...options,
      model: openai(options.model),
      schema
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