/**
 * Throttle function: returns a function that, when invoked repeatedly, will only actually call
 * the original function at most once per every `wait` milliseconds.
 * @param func The function to throttle.
 * @param wait The number of milliseconds to throttle invocations to.
 * @param options Optional options: { leading: boolean, trailing: boolean }
 * @returns A throttled function.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => ReturnType<T> | void {
  let lastCall = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;
  let timeoutId: NodeJS.Timeout | null = null;
  let result: ReturnType<T> | void;

  const { leading = true, trailing = true } = options;

  const invokeNow = function () {
    lastCall = Date.now();
    timeoutId = null;
    if (lastArgs) {
      result = func.apply(lastContext, lastArgs);
      lastArgs = null;
      lastContext = null;
    }
  };

  const trailingInvoke = function () {
    if (lastArgs) {
      result = func.apply(lastContext, lastArgs);
      lastArgs = null;
      lastContext = null;
    }
    timeoutId = null;
  };

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    if (!lastCall && !leading) {
      lastCall = now;
    }
    const remaining = wait - (now - lastCall);
    lastContext = this;
    lastArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      result = func.apply(this, args);
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(trailingInvoke, remaining);
    }

    return result;
  };
}
