"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../src/index");
(0, vitest_1.describe)("throttle", () => {
    (0, vitest_1.it)("should throttle a function", () => {
        const mockFn = vitest_1.vi.fn();
        const throttled = (0, index_1.throttle)(mockFn, 100);
        throttled();
        throttled();
        throttled();
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1);
        vitest_1.vi.advanceTimersByTime(100);
        throttled();
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)("should respect leading and trailing options", () => {
        const mockFn = vitest_1.vi.fn();
        const throttled = (0, index_1.throttle)(mockFn, 100, { leading: false, trailing: true });
        throttled(); // first call, leading false -> not called
        throttled(); // second call
        throttled(); // third call
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(0);
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1); // trailing call after wait
        throttled(); // new call after wait
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1); // still 1, waiting for trailing
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(2); // trailing of the new call
    });
    (0, vitest_1.it)("should pass arguments and context", () => {
        const mockFn = vitest_1.vi.fn((a, b) => `${a}-${b}`);
        const throttled = (0, index_1.throttle)(mockFn, 100);
        throttled.call({ custom: "context" }, 1, "a");
        throttled.call({ custom: "context" }, 2, "b");
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1);
        // Should have been called with the last arguments
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith(2, "b");
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith({ custom: "context" });
    });
});
//# sourceMappingURL=throttle.test.js.map