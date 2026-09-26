"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
function throttle(func, wait, options = {}) {
    let lastCall = 0;
    let lastArgs = null;
    let lastContext = null;
    let timeoutId = null;
    let result;
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
    return function (...args) {
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
        }
        else if (!timeoutId && trailing) {
            timeoutId = setTimeout(trailingInvoke, remaining);
        }
        return result;
    };
}
//# sourceMappingURL=throttle.js.map