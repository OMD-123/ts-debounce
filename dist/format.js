"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
function format(template, ...args) {
    if (args.length === 0)
        return template;
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
        const data = args[0];
        let escaped = template.replace(/{{/g, '\x00').replace(/}}/g, '\x01');
        const result = escaped.replace(/\{([^}]+)\}/g, (match, key) => {
            return key in data ? String(data[key]) : match;
        });
        return result.replace(/\x00/g, '{').replace(/\x01/g, '}');
    }
    let escaped = template.replace(/{{/g, '\x00').replace(/}}/g, '\x01');
    const result = escaped.replace(/\{(\d+)\}/g, (match, index) => {
        const idx = parseInt(index, 10);
        return idx in args ? String(args[idx]) : match;
    });
    return result.replace(/\x00/g, '{').replace(/\x01/g, '}');
}
//# sourceMappingURL=format.js.map