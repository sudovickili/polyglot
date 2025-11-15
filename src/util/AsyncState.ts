interface Idle { status: 'idle' }
interface Loading { status: 'loading' }
interface Success<T> { status: 'success'; data: T }
interface Error { status: 'error'; error: string }

export type AsyncState<T> = Idle | Loading | Success<T> | Error;

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