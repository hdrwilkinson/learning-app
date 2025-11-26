---
name: testing
description: Testing guidelines for Jest and Playwright. Part of Quality category (_hub-quality). Use when writing tests, implementing test coverage, or fixing test failures. Trigger phrases include "write tests", "add tests", "jest", "playwright", "unit test", "e2e test", "test coverage".
---

# Testing

## Purpose & Context (WHY)

**Problem**: Untested code leads to regressions and unreliable software.

**Solution**: Comprehensive testing strategy with Jest (unit/integration) and Playwright (E2E).

**Principle**: Test alongside code (TDD/BDD recommended). Prioritize coverage of critical logic and user flows. **Don't do 'change detector' testing** - ensure testing covers desired functionality.

## Test Types Overview

| Type                  | Tool       | Scope                                   |
| --------------------- | ---------- | --------------------------------------- |
| **Unit Tests**        | Jest       | Individual units; mock dependencies     |
| **Integration Tests** | Jest       | Interactions between modules; mock APIs |
| **E2E Tests**         | Playwright | Realistic user journeys; minimal mocks  |

## Running Tests

```bash
# Jest tests
npm test
npm run test:watch

# Playwright tests
npm run test:e2e
```

**Always run tests before committing**.

## Quick Reference

### Jest Best Practices

- **Naming**: `*.test.ts(x)` or `*.spec.ts(x)` alongside code or in `__tests__/`
- **Pattern**: Arrange → Act → Assert
- **Mocks**: `jest.fn()`, `jest.mock('module')`, `jest.spyOn`
- **React Components**: Use `@testing-library/react` for user interactions

### Playwright Best Practices

- **Structure**: E2E tests in `/e2e/tests/*.spec.ts`
- **Focus**: Critical user journeys (e.g., login, checkout)
- **Realism**: Minimal mocking; use emulators when applicable

## Resources

**For detailed patterns**:

- **MANDATORY**: Load `reference/jest-patterns.md` for Jest examples and patterns
- **MANDATORY**: Load `reference/playwright-patterns.md` for Playwright examples

## Key Principles

1. **Test functionality, not implementation** - Avoid change detector tests
2. **Arrange → Act → Assert** - Clear test structure
3. **Mock external dependencies** - Keep tests isolated
4. **Critical paths first** - Prioritize user-facing functionality
5. **Run tests locally** - Before every commit
