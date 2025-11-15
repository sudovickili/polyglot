import { AsyncState, Async } from "@/util/AsyncState"
import { useEffect, useState } from "react";

export function useAsync<T>(asyncFunc: () => Promise<T>, deps: any[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>(Async.idle());

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setState(Async.loading());
      try {
        const data = await asyncFunc();
        if (cancelled) return;
        setState(Async.success(data));
      } catch (error) {
        if (cancelled) return;
        setState(Async.error(`${error}`));
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}