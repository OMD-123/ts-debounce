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
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, options?: DebounceOptions): DebouncedFunction<T>;
//# sourceMappingURL=debounce.d.ts.map