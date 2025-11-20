
import { z } from 'zod';

export const IdleSchema = z.object({ status: z.literal('idle') });
export const LoadingSchema = z.object({ status: z.literal('loading') });
export const SuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({ status: z.literal('success'), data: dataSchema });
export const ErrorSchema = z.object({ status: z.literal('error'), error: z.string() });

export function AsyncStateSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([
    IdleSchema,
    LoadingSchema,
    SuccessSchema(dataSchema),
    ErrorSchema,
  ]);
}

export type AsyncState<T> =
  | z.infer<typeof IdleSchema>
  | z.infer<typeof LoadingSchema>
  | { status: 'success'; data: T }
  | z.infer<typeof ErrorSchema>;

export namespace Async {
  export function idle<T>(): AsyncState<T> {
    return { status: 'idle' };
  }

  export function loading<T>(): AsyncState<T> {
    return { status: 'loading' };
  }

  export function success<T>(data: T): AsyncState<T> {
    return { status: 'success', data };
  }

  export function error<T>(error: string): AsyncState<T> {
    return { status: 'error', error };
  }
}