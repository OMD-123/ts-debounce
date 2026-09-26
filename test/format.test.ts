import { describe, it, expect } from "vitest";
import { format } from "../src/index";

describe("format", () => {
  it("should format with indexed placeholders", () => {
    const result = format("Hello {0}, you are {1} years old.", "Alice", 30);
    expect(result).toBe("Hello Alice, you are 30 years old.");
  });

  it("should format with named placeholders", () => {
    const result = format("Hello {name}, you are {age} years old.", { name: "Bob", age: 25 });
    expect(result).toBe("Hello Bob, you are 25 years old.");
  });

  it("should leave unknown placeholders as is", () => {
    const result = format("Hello {0}, you are {1} years old. You live in {city}.", "Charlie", 35);
    expect(result).toBe("Hello Charlie, you are 35 years old. You live in {city}.");
  });

  it("should return template if no args", () => {
    const result = format("Hello world");
    expect(result).toBe("Hello world");
  });

  it("should handle empty string", () => {
    const result = format("", "anything");
    expect(result).toBe("");
  });
});
