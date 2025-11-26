---
name: _hub-quality
description: Code quality skills hub. Routes to debugging, testing, linting, and refactoring. Use when fixing bugs, writing tests, resolving lint errors, or improving code structure.
---

# Code Quality Skills Hub

## Purpose

This hub helps you choose the right skill for code quality tasks. It provides:

- **Decision tree**: Which skill do I need?
- **Cross-skill workflows**: Common multi-skill patterns
- **Category context**: Shared principles for maintaining code quality

## Decision Tree

| If you need to...          | Use this skill |
| -------------------------- | -------------- |
| Fix an error or bug        | `debugging`    |
| Write or fix tests         | `testing`      |
| Fix lint/TypeScript errors | `linting`      |
| Improve code structure     | `refactoring`  |

## Sub-Skills in This Category

### debugging

**Use when**: Errors occur in code, tests fail, issues need investigation

**Trigger phrases**: "debug", "fix error", "test failing", "investigate bug"

**Path**: `/skills/debugging/SKILL.md`

---

### testing

**Use when**: Writing tests, implementing test coverage, fixing test failures

**Trigger phrases**: "write tests", "add tests", "jest", "playwright", "unit test", "e2e test"

**Path**: `/skills/testing/SKILL.md`

---

### linting

**Use when**: Fixing linting errors, configuring code style, TypeScript issues

**Trigger phrases**: "lint error", "eslint", "typescript error", "prettier"

**Path**: `/skills/linting/SKILL.md`

---

### refactoring

**Use when**: Improving code structure without changing behavior

**Trigger phrases**: "refactor", "extract", "restructure code", "clean up"

**Path**: `/skills/refactoring/SKILL.md`

---

## Cross-Skill Workflows

### Fixing a Failing Test

When a test fails, combine skills in this order:

1. **debugging**: Reproduce and isolate the issue
2. **testing**: Understand what the test expects
3. _(fix the code)_
4. **testing**: Verify the fix passes

### Adding Tests to Existing Code

When adding test coverage:

1. **refactoring**: Extract testable units if needed
2. **testing**: Write tests for the extracted units
3. **linting**: Ensure tests follow code style

### Pre-Commit Quality Check

Before committing, run this workflow:

1. **linting**: `npm run lint` - fix any style issues
2. **testing**: `npm test` - ensure all tests pass
3. **debugging**: If anything fails, investigate and fix

## Category Principles

1. **Reproduce before fixing**: Always understand the problem first
2. **Test behavior, not implementation**: Tests should survive refactoring
3. **Small, verified changes**: Each change should be testable
4. **Consistent style**: Linting reduces cognitive load
5. **Safe refactoring**: Never refactor without test coverage

---

_Hub established November 2025 for the Learning App (Cognia) project._
