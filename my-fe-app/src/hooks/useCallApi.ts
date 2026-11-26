import { useCallback, useEffect, useRef, useState } from "react";

// Gọi một hàm bất đồng bộ kèm trạng thái loading, error, data.
// Lần gọi mới hủy lần gọi cũ; unmount cũng hủy (signal truyền vào hàm để dừng request).
export function useCallApi<TArgs extends unknown[], TData>(
  fn: (signal: AbortSignal, ...args: TArgs) => Promise<TData>,
) {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TData | undefined> => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const result = await fn(controller.signal, ...args);
        if (!controller.signal.aborted) setData(result);
        return result;
      } catch (e) {
        if (!controller.signal.aborted) setError(e);
        return undefined;
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [fn],
  );

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { data, error, loading, run };
}
