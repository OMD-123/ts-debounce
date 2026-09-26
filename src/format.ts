/**
 * Simple string format function.
 * Replaces placeholders like {0}, {1}, ... with corresponding arguments.
 * Also supports named placeholders like {name} if an object is passed as first arg.
 * @param template The template string with placeholders.
 * @param args The values to replace placeholders with.
 * @returns Formatted string.
 */
export function format(template: string, ...args: any[]): string {
  if (args.length === 0) return template;

  // If first argument is an object, treat as named placeholders
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
    const data = args[0];
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      return key in data ? String(data[key]) : match;
    });
  }

  // Otherwise treat as indexed placeholders
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const idx = parseInt(index, 10);
    return idx in args ? String(args[idx]) : match;
  });
}
