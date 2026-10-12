/**
 * Simple string format function.
 * Replaces placeholders like {0}, {1}, ... with corresponding arguments.
 * Also supports named placeholders like {name} if an object is passed as first arg.
 * Handles escaped braces: {{ and }} are treated as literal braces.
 * @param template The template string with placeholders.
 * @param args The values to replace placeholders with.
 * @returns Formatted string.
 */
export declare function format(template: string, ...args: any[]): string;
//# sourceMappingURL=format.d.ts.map