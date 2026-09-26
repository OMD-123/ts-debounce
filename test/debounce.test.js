"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../src/index");
(0, vitest_1.describe)("debounce", () => {
    (0, vitest_1.it)("should debounce a function", () => {
        const mockFn = vitest_1.vi.fn();
        const debounced = (0, index_1.debounce)(mockFn, 100);
        debounced();
        debounced();
        debounced();
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(0);
        // Fast forward time
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)("should invoke immediately if immediate is true", () => {
        const mockFn = vitest_1.vi.fn();
        const debounced = (0, index_1.debounce)(mockFn, 100, true);
        debounced();
        debounced();
        debounced();
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1);
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1); // No additional call
    });
    (0, vitest_1.it)("should pass arguments and context", () => {
        const mockFn = vitest_1.vi.fn((a, b) => `${a}-${b}`);
        const debounced = (0, index_1.debounce)(mockFn, 100);
        debounced.call({ custom: "context" }, 42, "hello");
        vitest_1.vi.advanceTimersByTime(100);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith(42, "hello");
        (0, vitest_1.expect)(mockFn).toHaveBeenCalledWith({ custom: "context" });
    });
});
//# sourceMappingURL=debounce.test.js.map