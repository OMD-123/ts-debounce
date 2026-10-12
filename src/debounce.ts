
/**
 * Debounce function options
 */
export interface DebounceOptions {
  /** Invoke on the leading edge of the timeout */
  leading?: boolean;
  /** Invoke on the trailing edge of the timeout */
  trailing?: boolean;
  /** Maximum time the function is allowed to be delayed before it's executed */
  maxWait?: number;
}

/**
 * Debounced function with additional control methods
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | Promise<ReturnType<T>> | void;
  /** Cancel any pending execution */
  cancel(): void;
  /** Immediately invoke the function if there's a pending execution */
  flush(): ReturnType<T> | Promise<ReturnType<T>> | void;
  /** Check if there's a pending execution */
  pending(): boolean;
}

/**
 * Debounce function: returns a function that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for N milliseconds.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param options Optional options: { leading, trailing, maxWait }
 * @returns A debounced function with cancel/flush methods
 * 
 * @example
 * ```ts
 * const save = debounce(async (data: string) => {
 *   await api.save(data);
 * }, 300, { maxWait: 1000 });
 * 
 * save('data'); // starts timer
 * save.flush(); // forces immediate execution
 * save.cancel(); // cancels pending execution
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let maxTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: ThisParameterType<T> | null = null;
  let lastCallTime: number | null = null;
  let result: ReturnType<T> | Promise<ReturnType<T>> | void;

  const invokeFunc = (): ReturnType<T> | Promise<ReturnType<T>> | void => {
    if (lastArgs) {
      result = func.apply(lastContext, lastArgs);
      lastArgs = null;
      lastContext = null;
      lastCallTime = Date.now();
    }
    return result;
  };

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): ReturnType<T> | Promise<ReturnType<T>> | void {
    const context = this;
    const now = Date.now();
    
    lastArgs = args;
    lastContext = context;

    const isFirstCall = lastCallTime === null;

    // Handle leading edge - only on first call
    if (leading && isFirstCall) {
      return invokeFunc();
    }

    // Clear existing trailing timeout
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Handle maxWait
    if (maxWait) {
      if (!maxTimeout) {
        maxTimeout = setTimeout(() => {
          maxTimeout = null;
          if (lastArgs) {
            invokeFunc();
          }
        }, isFirstCall ? maxWait : wait);
      }
    }

    // Handle trailing edge
    if (trailing) {
      timeout = setTimeout(() => {
        timeout = null;
        // Only invoke if maxWait hasn't already fired
        if (!maxTimeout || maxWait === undefined) {
          if (lastArgs) {
            invokeFunc();
          }
        }
        if (maxTimeout) {
          clearTimeout(maxTimeout);
          maxTimeout = null;
        }
      }, wait);
    }

    return result;
  } as DebouncedFunction<T>;

  // Add control methods
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = null;
    }
    lastArgs = null;
    lastContext = null;
    lastCallTime = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = null;
    }
    return invokeFunc();
  };

  debounced.pending = () => {
    return timeout !== null || maxTimeout !== null;
  };

  return debounced;
}
