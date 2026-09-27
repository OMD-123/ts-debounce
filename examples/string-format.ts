// String Formatting Examples
// Run with: npx ts-node examples/string-format.ts

import { format } from '../src/index';

console.log('=== String Formatting Examples ===\n');

// 1. Indexed placeholders
console.log('1. Indexed placeholders:');
console.log(format('Hello {0}, you have {1} new messages', 'Alice', 5));
console.log(format('{0} + {1} = {2}', 2, 3, 5));
console.log();

// 2. Named placeholders (object)
console.log('2. Named placeholders:');
console.log(format('User: {name}, Email: {email}', { name: 'Bob', email: 'bob@example.com' }));
console.log(format('{greeting}, {name}!', { greeting: 'Welcome', name: 'Charlie' }));
console.log();

// 3. Mixed (array for indexed, object for named)
console.log('3. Mixed indexed and named:');
console.log(format('{0} and {name}', ['first'], { name: 'second' }));
console.log();

// 4. Escaping braces
console.log('4. Escaping braces:');
console.log(format('{{literal}} and {0}', 'placeholder'));
console.log(format('{{{nested}}}', { nested: 'value' }));
console.log();

// 5. Nested objects (dot notation)
console.log('5. Nested objects (dot notation):');
const user = {
  profile: { name: 'Alice', age: 30 },
  settings: { theme: 'dark', notifications: true }
};
console.log(format('Name: {profile.name}, Theme: {settings.theme}', user));
console.log();

// 6. Default values (manual handling)
console.log('6. Handling undefined:');
console.log(format('Value: {value}', { value: 'present' }));
console.log(format('Value: {value}', { value: undefined }));
console.log();

// 7. Arrays in objects
console.log('7. Arrays in objects:');
const data = { tags: ['typescript', 'utility', 'debounce'] };
console.log(format('Tags: {tags}', data));
console.log();

// 8. Special characters
console.log('8. Special characters:');
console.log(format('Path: {path}', { path: 'C:\\Users\\Documents' }));
console.log(format('JSON: {json}', { json: '{"key":"value"}' }));
console.log();

// 9. Real-world: Logging template
console.log('9. Logging template:');
function log(level: string, message: string, meta?: Record<string, any>) {
  const template = meta 
    ? '[{timestamp}] {level}: {message} | {meta}'
    : '[{timestamp}] {level}: {message}';
  console.log(format(template, {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    meta: meta ? JSON.stringify(meta) : undefined
  }));
}
log('info', 'Server started', { port: 3000, env: 'production' });
log('error', 'Connection failed', { retries: 3, host: 'db.example.com' });
log('warn', 'High memory usage');
console.log();

// 10. Real-world: i18n template
console.log('10. i18n template:');
const messages = {
  en: 'Welcome {name}! You have {count} notifications.',
  es: '¡Bienvenido {name}! Tienes {count} notificaciones.',
  fr: 'Bienvenue {name} ! Vous avez {count} notifications.'
};
['en', 'es', 'fr'].forEach(lang => {
  console.log(format(messages[lang], { name: 'User', count: 42 }));
});

export {};