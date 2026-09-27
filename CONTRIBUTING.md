# Contributing to ts-debounce

Thank you for your interest in contributing to ts-debounce! This guide will help you get started.

## 🎯 Quick Start

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/ts-debounce.git
cd ts-debounce

# 3. Install dependencies
npm install

# 4. Run tests to verify setup
npm test

# 5. Make your changes
# 6. Run tests again
npm test

# 7. Build to verify compilation
npm run build

# 8. Commit and push
git add .
git commit -m "feat: your descriptive message"
git push origin main

# 9. Open a Pull Request
```

## 📋 Development Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests with Vitest |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run typecheck` | Type-check without emitting files |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## 🧪 Testing Guidelines

### Writing Tests

1. **Place tests in `test/` directory** with `.test.ts` extension
2. **Follow existing patterns** in `test/debounce.test.ts`, `test/throttle.test.ts`, `test/format.test.ts`
3. **Use Vitest** with fake timers for timing-dependent tests
4. **Test edge cases**: empty inputs, boundary values, cancellation, flushing

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../src/index';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should delay invocation', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    
    debounced();
    expect(fn).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

### Test Categories

- **Unit tests**: Individual function behavior
- **Edge cases**: Empty strings, undefined, large inputs
- **Integration**: Combined usage (debounce + throttle)
- **Type tests**: TypeScript compilation verification (in `typescript-playground.ts`)

## 🏗️ Building

```bash
# Full build (compiles to dist/)
npm run build

# Type-check only (faster, no output)
npm run typecheck
```

The build outputs:
- `dist/*.js` - ES2020 CommonJS
- `dist/*.d.ts` - TypeScript declarations
- `dist/*.js.map` - Source maps
- `dist/*.d.ts.map` - Declaration maps

## 📝 Code Style

### TypeScript

- **Strict mode enabled** - No `any` unless absolutely necessary
- **Explicit return types** for public APIs
- **Generics over overloads** where possible
- **JSDoc comments** for all exported functions

### Formatting

- **2 spaces** indentation
- **Single quotes** for strings
- **Trailing commas** in multiline objects/arrays
- **Semicolons** required

### Naming Conventions

- **camelCase** for variables, functions, methods
- **PascalCase** for types, interfaces, classes
- **UPPER_SNAKE_CASE** for constants
- **Descriptive names** over abbreviations

## 🔄 Pull Request Process

### Before Submitting

1. **Run all tests**: `npm test`
2. **Build successfully**: `npm run build`
3. **Update documentation** if API changes
4. **Add tests** for new functionality
5. **Update CHANGELOG.md** (if applicable)

### PR Checklist

- [ ] Tests pass locally
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Documentation updated
- [ ] Tests added for new features
- [ ] Commit messages follow conventional commits
- [ ] No unrelated changes (whitespace, formatting)

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Maintenance

Examples:
```
feat(debounce): add maxWait option
fix(throttle): handle leading=false edge case
docs(readme): add React hook examples
test(format): add nested object tests
```

## 🐛 Reporting Issues

### Bug Reports

Include:
1. **Minimal reproduction** (code snippet or failing test)
2. **Expected vs actual behavior**
3. **Environment** (Node version, browser, TypeScript version)
4. **Version** of ts-debounce

### Feature Requests

Include:
1. **Use case** - Why is this needed?
2. **Proposed API** - How should it work?
3. **Alternatives considered** - Why this approach?
4. **Breaking changes** - Any migration needed?

## 🏷️ Good First Issues

Look for issues labeled [`good first issue`](https://github.com/OMD-123/ts-debounce/labels/good%20first%20issue):

- **Documentation**: Add examples, improve README
- **Tests**: Add edge case coverage
- **Examples**: Create real-world usage examples
- **Types**: Improve TypeScript inference

## 📚 Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Related Projects
- [lodash](https://lodash.com/) - Reference implementations
- [just-debounce-it](https://github.com/justjs/just-debounce-it) - Minimal alternative

## 🤝 Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the maintainers.

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Questions?** Open an issue or start a discussion. We're happy to help!