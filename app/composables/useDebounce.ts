/**
 * Simple debounce composable.
 * Returns a debounced version of the provided function.
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(fn: T, delayMs: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delayMs)
  } as T
}
