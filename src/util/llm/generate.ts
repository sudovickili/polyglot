import { generateText, generateObject, streamObject, LanguageModel } from "ai"
import z from "zod"
import { Err, Ok, Result } from "../result/Result"
import { Streamed, StreamedState } from "../StreamedState"
import { Log } from "../Log"

interface Options {
  model: LanguageModel
  prompt: string,
  temperature?: number,
  maxOutputTokens?: number,
}

export async function generate(options: Options): Promise<Result<string>> {
  try {
    const { text } = await generateText({
      ...options
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
    const { fullStream, object } = streamObject({
      ...options,
      schema
    })

    let streamError: unknown = undefined
    for await (const event of fullStream) {
      if (event.type === 'object') {
        const t_partial = partialSchema.safeParse(event.object)
        if (t_partial.success) {
          onData(Streamed.loading(t_partial.data))
        } else {
          Log.error(`streamObj error parsing partial ${JSON.stringify(event.object, null, 2)}`, t_partial.error)
        }
      } else if (event.type === 'error') {
        streamError = event.error
        Log.error(`streamObj stream error`, event.error)
      }
    }

    if (streamError) {
      onData(Streamed.error(String(streamError)))
    } else {
      /** WARNING: the object promise will never resolve in the event of a stream error */
      const t = await object as T
      onData(Streamed.success(t))
    }
  } catch (e) {
    Log.error(`streamObj error`, e)
    onData(Streamed.error(String(e)))
  }
}