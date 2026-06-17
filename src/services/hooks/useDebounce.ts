import { useEffect, useState } from "react";

const DELAY_DEFAULT = 300;

/**
 * Custom React hook that debounces a value by a specified delay.
 *
 * @param {T} value - The value to debounce.
 * @param {number} [delay=DELAY_DEFAULT] - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? DELAY_DEFAULT);

    // Cleanup: Clear the timer if the value changes before the delay is hit
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
