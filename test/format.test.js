"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../src/index");
(0, vitest_1.describe)("format", () => {
    (0, vitest_1.it)("should format with indexed placeholders", () => {
        const result = (0, index_1.format)("Hello {0}, you are {1} years old.", "Alice", 30);
        (0, vitest_1.expect)(result).toBe("Hello Alice, you are 30 years old.");
    });
    (0, vitest_1.it)("should format with named placeholders", () => {
        const result = (0, index_1.format)("Hello {name}, you are {age} years old.", { name: "Bob", age: 25 });
        (0, vitest_1.expect)(result).toBe("Hello Bob, you are 25 years old.");
    });
    (0, vitest_1.it)("should leave unknown placeholders as is", () => {
        const result = (0, index_1.format)("Hello {0}, you are {1} years old. You live in {city}.", "Charlie", 35);
        (0, vitest_1.expect)(result).toBe("Hello Charlie, you are 35 years old. You live in {city}.");
    });
    (0, vitest_1.it)("should return template if no args", () => {
        const result = (0, index_1.format)("Hello world");
        (0, vitest_1.expect)(result).toBe("Hello world");
    });
    (0, vitest_1.it)("should handle empty string", () => {
        const result = (0, index_1.format)("", "anything");
        (0, vitest_1.expect)(result).toBe("");
    });
});
//# sourceMappingURL=format.test.js.map