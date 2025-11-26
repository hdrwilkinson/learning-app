---
name: linting
description: ESLint, TypeScript, and Prettier configuration and patterns. Use when fixing linting errors, configuring code style, or resolving TypeScript issues. Triggers include "lint error", "eslint", "typescript error", "prettier".
---

# Linting Skill

## Purpose & Context (WHY)

Consistent code style reduces cognitive load and prevents bugs. This skill covers ESLint, TypeScript, and Prettier patterns used in the project.

**When to use**: Fixing lint errors, understanding ESLint rules, resolving TypeScript issues.

**When to skip**: If errors are caused by a bug, use the `debugging` skill instead.

## Quick Commands

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Type check
npx tsc --noEmit
```

## Common Lint Errors

### React Hooks

```typescript
// ❌ Error: React Hook useEffect has a missing dependency
useEffect(() => {
    fetchData(userId);
}, []);

// ✅ Fix: Add dependency
useEffect(() => {
    fetchData(userId);
}, [userId]);

// ✅ Or: Intentionally ignore with comment
useEffect(() => {
    fetchData(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### Unused Variables

```typescript
// ❌ Error: 'unusedVar' is defined but never used
const unusedVar = "hello";

// ✅ Fix: Remove or prefix with underscore
const _intentionallyUnused = "hello";
```

### TypeScript Errors

```typescript
// ❌ Error: Property 'x' does not exist on type 'Y'
interface User {
    name: string;
}
const user: User = { name: "John", age: 30 }; // age not in type

// ✅ Fix: Update interface
interface User {
    name: string;
    age: number;
}
```

## ESLint Configuration

```javascript
// eslint.config.mjs (root)
// Project-specific rules are configured here
```

### Ignoring Files

```
# .eslintignore
node_modules/
.next/
coverage/
```

## TypeScript Patterns

### Type Assertions

```typescript
// ❌ Avoid: Type assertion hiding issues
const user = response as User;

// ✅ Better: Type guard
function isUser(obj: unknown): obj is User {
    return typeof obj === "object" && obj !== null && "name" in obj;
}

if (isUser(response)) {
    // TypeScript knows response is User
}
```

### Handling `null` and `undefined`

```typescript
// ❌ Error: Object is possibly 'undefined'
const name = user.profile.name;

// ✅ Fix: Optional chaining
const name = user?.profile?.name;

// ✅ Or: Non-null assertion (when you're certain)
const name = user!.profile!.name;
```

## Suppressing Errors

### When to Suppress

- **Temporary**: During refactoring, with TODO to fix
- **Intentional**: When ESLint rule doesn't apply

### How to Suppress

```typescript
// Single line
// eslint-disable-next-line rule-name
const x = problematicCode;

// Multiple lines
/* eslint-disable rule-name */
// ... code
/* eslint-enable rule-name */

// TypeScript ignore
// @ts-ignore - Reason why this is necessary
// @ts-expect-error - Preferred when error is expected
```

## Pre-Commit Checklist

Before committing:

1. [ ] `npm run lint` passes
2. [ ] `npx tsc --noEmit` passes
3. [ ] No `// @ts-ignore` without explanation
4. [ ] No `eslint-disable` without explanation

## Resources

**This Skill**:

- `reference/eslint-rules.md` - Common ESLint rules explained

**Related Skills**:

- `debugging` - For actual bugs, not lint errors
- `testing` - Test file linting patterns

## Key Principle

Consistent code style reduces cognitive load.

---

_Skill established November 2025 for the Learning App (Cognia) project._
