"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
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
function throttle(func, wait, options = {}) {
    const { leading = true, trailing = true } = options;
    let lastCall = 0;
    let lastArgs = null;
    let lastContext = null;
    let timeoutId = null;
    let result;
    const invokeFunc = () => {
        if (lastArgs) {
            result = func.apply(lastContext, lastArgs);
            lastArgs = null;
            lastContext = null;
            lastCall = Date.now();
        }
        return result;
    };
    const throttled = function (...args) {
        const now = Date.now();
        const context = this;
        lastArgs = args;
        lastContext = context;
        // First call handling
        const isFirstCall = lastCall === 0;
        if (isFirstCall) {
            if (leading) {
                lastCall = now;
                return invokeFunc();
            }
            else {
                lastCall = now;
                // Don't execute yet, wait for trailing
            }
        }
        const remaining = wait - (now - lastCall);
        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            return invokeFunc();
        }
        else if (!timeoutId && trailing) {
            timeoutId = setTimeout(() => {
                timeoutId = null;
                lastCall = leading ? Date.now() : 0;
                if (lastArgs) {
                    invokeFunc();
                }
            }, remaining);
        }
        return result;
    };
    // Add control methods
    throttled.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastArgs = null;
        lastContext = null;
        lastCall = 0;
    };
    throttled.flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        return invokeFunc();
    };
    throttled.pending = () => {
        return timeoutId !== null;
    };
    return throttled;
}
//# sourceMappingURL=throttle.js.map