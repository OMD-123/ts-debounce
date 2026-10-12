/**
 * Throttle function options
 */
export interface ThrottleOptions {
    /** Invoke on the leading edge of the timeout */
    leading?: boolean;
    /** Invoke on the trailing edge of the timeout */
    trailing?: boolean;
}
/**
 * Throttled function with additional control methods
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | Promise<ReturnType<T>> | void;
    /** Cancel any pending execution */
    cancel(): void;
    /** Immediately invoke the function if there's a pending execution */
    flush(): ReturnType<T> | Promise<ReturnType<T>> | void;
    /** Check if there's a pending execution */
    pending(): boolean;
}
/**
 * Throttle function: returns a function that, when invoked repeatedly, will only actually call
 * the original function at most once per every `wait` milliseconds.
 *
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options Optional options: { leading, trailing }
 * @returns A throttled function with cancel/flush methods
 *
 * @example
 * ```ts
 * const onScroll = throttle(() => {
 *   updatePosition();
 * }, 16, { leading: true, trailing: true });
 *
 * window.addEventListener('scroll', onScroll);
 * onScroll.cancel(); // cleanup on unmount
 * ```
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: ThrottleOptions): ThrottledFunction<T>;
//# sourceMappingURL=throttle.d.ts.map