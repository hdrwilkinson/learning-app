---
name: code-review
description: PR review patterns and feedback guidelines. Use when reviewing pull requests, providing code feedback, or approving changes. Triggers include "review PR", "code review", "pull request".
---

# Code Review Skill

## Purpose & Context (WHY)

Code reviews are essential for maintaining code quality, sharing knowledge, and catching issues early. This skill provides a systematic approach to reviewing pull requests that balances thoroughness with efficiency.

**When to use**: Reviewing someone else's PR, self-reviewing before requesting review, or providing feedback on code changes.

**When to skip**: For trivial changes (typos, formatting), a quick approval may be sufficient.

## Review Checklist

### 1. Understand the Context

Before diving into code:

- [ ] Read the PR description and linked issue
- [ ] Understand what problem is being solved
- [ ] Check if the approach was discussed beforehand

### 2. High-Level Review

Start with the big picture:

- [ ] Does the solution match the requirements?
- [ ] Is the approach appropriate for the problem?
- [ ] Are there any architectural concerns?
- [ ] Is the scope appropriate (not too large)?

### 3. Code Quality

Check the implementation:

- [ ] Is the code readable and well-organized?
- [ ] Are there any obvious bugs or edge cases?
- [ ] Is error handling appropriate?
- [ ] Are there any security concerns?

### 4. Tests

Verify test coverage:

- [ ] Are new features tested?
- [ ] Do tests cover edge cases?
- [ ] Are tests readable and maintainable?

### 5. Documentation

Check for docs:

- [ ] Are complex parts documented?
- [ ] Is the PR description clear?
- [ ] Are breaking changes documented?

## Feedback Guidelines

### Tone

- **Be kind**: The code, not the person
- **Be specific**: Point to exact lines, suggest fixes
- **Be constructive**: Explain why, not just what

### Comment Types

Use prefixes to indicate severity:

| Prefix        | Meaning                        |
| ------------- | ------------------------------ |
| `nit:`        | Minor suggestion, not blocking |
| `suggestion:` | Consider this, but your call   |
| `question:`   | Need clarification             |
| `blocker:`    | Must be addressed before merge |

### Examples

**Good feedback**:

```
suggestion: Consider using `useMemo` here to avoid recalculating on every render.
The current implementation recalculates `filteredItems` even when `items` hasn't changed.
```

**Poor feedback**:

```
This is inefficient.
```

## Self-Review Checklist

Before requesting review:

1. [ ] Run `npm run lint` and `npm test`
2. [ ] Review your own diff - pretend it's someone else's code
3. [ ] Check for console.logs, commented code, TODOs
4. [ ] Verify PR description explains the changes
5. [ ] Link the related issue

## Resources

**This Skill**:

- `reference/review-patterns.md` - Common patterns to look for

**Related Skills**:

- `testing` - For reviewing test quality
- `debugging` - For investigating issues found during review
- `pushing-code` - For commit message conventions

## Key Principle

Review code as you'd want yours reviewed: thorough, kind, and constructive.

---

_Skill established November 2025 for the Learning App (Cognia) project._
