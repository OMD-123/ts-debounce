"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
/**
 * Simple string format function.
 * Replaces placeholders like {0}, {1}, ... with corresponding arguments.
 * Also supports named placeholders like {name} if an object is passed as first arg.
 * Handles escaped braces: {{ and }} are treated as literal braces.
 * @param template The template string with placeholders.
 * @param args The values to replace placeholders with.
 * @returns Formatted string.
 */
function format(template, ...args) {
    if (args.length === 0)
        return template;
    // If first argument is an object, treat as named placeholders
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
        const data = args[0];
        // First, escape escaped braces
        let escaped = template.replace(/{{/g, '\x00').replace(/}}/g, '\x01');
        // Replace placeholders
        const result = escaped.replace(/\{([^}]+)\}/g, (match, key) => {
            return key in data ? String(data[key]) : match;
        });
        // Restore escaped braces
        return result.replace(/\x00/g, '{').replace(/\x01/g, '}');
    }
    // Otherwise treat as indexed placeholders
    // First, escape escaped braces
    let escaped = template.replace(/{{/g, '\x00').replace(/}}/g, '\x01');
    // Replace placeholders
    const result = escaped.replace(/\{(\d+)\}/g, (match, index) => {
        const idx = parseInt(index, 10);
        return idx in args ? String(args[idx]) : match;
    });
    // Restore escaped braces
    return result.replace(/\x00/g, '{').replace(/\x01/g, '}');
}
//# sourceMappingURL=format.js.map