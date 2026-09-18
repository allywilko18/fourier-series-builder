import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has been stable for `delay` milliseconds.
 *
 * Used to keep a slider label instant while deferring the expensive path
 * rebuild until the drag settles. The cleanup is the important part: each
 * change cancels the timer from the previous render, so only the final value
 * in a burst ever lands.
 */
export function useDebounced<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setSettled(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return settled;
}