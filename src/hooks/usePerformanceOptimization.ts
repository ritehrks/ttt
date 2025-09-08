import { useMemo } from 'react';
import { debounce, throttle } from 'lodash';

// Debounce: Waits for the user to stop an activity (like typing) before running a function.
export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  return useMemo(() => debounce(callback, delay), [callback, delay]);
};

// Throttle: Ensures a function is not called more than once every X milliseconds.
export const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  return useMemo(() => throttle(callback, delay), [callback, delay]);
};