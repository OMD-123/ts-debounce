"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
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
function debounce(func, wait, options = {}) {
    const { leading = false, trailing = true, maxWait } = options;
    let timeout = null;
    let maxTimeout = null;
    let lastArgs = null;
    let lastContext = null;
    let lastCallTime = null;
    let result;
    const invokeFunc = () => {
        if (lastArgs) {
            result = func.apply(lastContext, lastArgs);
            lastArgs = null;
            lastContext = null;
            lastCallTime = Date.now();
        }
        return result;
    };
    const debounced = function (...args) {
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
    };
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
//# sourceMappingURL=debounce.js.map