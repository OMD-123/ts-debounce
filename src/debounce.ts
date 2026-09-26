/**
 * Debounce function: returns a function that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for N milliseconds.
 * If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param immediate Whether to execute on the leading edge.
 * @returns A debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => ReturnType<T> | void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
