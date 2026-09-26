"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
function format(template, ...args) {
    if (args.length === 0)
        return template;
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
        const data = args[0];
        return template.replace(/\{([^}]+)\}/g, (match, key) => {
            return key in data ? String(data[key]) : match;
        });
    }
    return template.replace(/\{(\d+)\}/g, (match, index) => {
        const idx = parseInt(index, 10);
        return idx in args ? String(args[idx]) : match;
    });
}
//# sourceMappingURL=format.js.map