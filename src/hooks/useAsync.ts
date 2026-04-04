import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const mountedRef = useRef(true);

  const run = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }));
    fn()
      .then(data => {
        if (mountedRef.current) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : 'Something went wrong';
          setState({ data: null, loading: false, error: message });
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { ...state, refetch: run };
}
