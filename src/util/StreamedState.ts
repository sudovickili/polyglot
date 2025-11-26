import { z } from 'zod';
import { Result } from './Result';

export const IdleSchema = z.object({ status: z.literal('idle') });
export const LoadingSchema = <T_Partial extends z.ZodTypeAny>(partialSchema: T_Partial) =>
  z.object({ status: z.literal('loading'), partial: partialSchema.optional() });
export const SuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({ status: z.literal('success'), val: dataSchema });
export const ErrorSchema = z.object({ status: z.literal('error'), err: z.string() });

export function StreamedStateSchema<T extends z.ZodTypeAny, T_Partial extends z.ZodTypeAny = T>(dataSchema: T, partialSchema?: T_Partial) {
  return z.union([
    IdleSchema,
    LoadingSchema(partialSchema ?? dataSchema),
    SuccessSchema(dataSchema),
    ErrorSchema,
  ]);
}

export type StreamedState<T, T_Partial = T> =
  | z.infer<typeof IdleSchema>
  | { status: 'loading'; partial?: T_Partial }
  | { status: 'success'; val: T }
  | z.infer<typeof ErrorSchema>;

export namespace Streamed {
  export function idle<T, T_Partial = T>(): StreamedState<T, T_Partial> {
    return { status: 'idle' };
  }

  export function loading<T, T_Partial = T>(partial?: T_Partial): StreamedState<T, T_Partial> {
    return { status: 'loading', partial };
  }

  export function success<T, T_Partial = T>(val: T): StreamedState<T, T_Partial> {
    return { status: 'success', val };
  }

  export function error<T, T_Partial = T>(err: string): StreamedState<T, T_Partial> {
    return { status: 'error', err: err };
  }

  export function fromResult<T, T_Partial = T>(result: Result<T>): StreamedState<T, T_Partial> {
    if (result.ok) {
      return success(result.val);
    } else {
      return error(result.err);
    }
  }
}