---
name: debugging
description: Systematic debugging approach for fixing errors and bugs. Part of Quality category (_hub-quality). Use when errors occur in code, tests fail, or issues need investigation. Trigger phrases include "debug", "fix error", "test failing", "investigate bug", "resolve issue", "error message".
---

# Debugging

## Purpose & Context (WHY)

**Problem**: Ad-hoc debugging leads to incomplete fixes, introducing new bugs or missing root causes.

**Solution**: Systematic approach - understand, isolate, fix one issue at a time with minimal changes.

**When to use**: Error occurs, test fails, or user reports a bug.

## Core Principles

1. **Fully understand** errors or bugs before attempting fixes
2. **Isolate each issue** before addressing it - solve one problem at a time
3. **Minimal, precise changes** - provide verifiable fixes
4. **Verify fixes** address the root cause by rerunning tests or manual verification
5. **No unrelated changes** - avoid refactoring or cleanup in bug-fix commits

## Debugging Workflow

### 1. Reproduce

- Confirm you can reproduce the error
- Document exact steps to trigger the issue
- Note error messages, stack traces, or unexpected behavior

### 2. Isolate

- Narrow down to the specific component/function causing the issue
- Check recent changes that might have introduced the bug
- Use logging or breakpoints to trace execution

### 3. Understand

- Read error messages carefully - they often point to the root cause
- Check relevant documentation or type definitions
- Understand the expected behavior vs actual behavior

### 4. Fix

- Make the minimal change needed to fix the issue
- Don't combine fixes with refactoring
- Document non-obvious fixes with comments

### 5. Verify

- Rerun the failing test(s)
- Manual verification if no automated test exists
- Check for regression in related functionality

## Specific Debugging Tips

### Database Issues (Prisma)

- Inspect Prisma logs
- Check migration drift
- Confirm schema alignment
- Verify database connection

### Web UI Issues

- Test components in isolation
- Verify Tailwind classes applied correctly
- Check shadcn component props/docs
- Inspect browser dev tools (console, network, elements)

### Test Failures

- Read the full error message
- Check test isolation (tests affecting each other)
- Verify mocks are set up correctly
- Run single test in isolation

## Key Principles

1. **One issue at a time** - Never try to fix multiple bugs simultaneously
2. **Root cause focus** - Fix the cause, not just the symptom
3. **Minimal changes** - Less code changed = less risk
4. **Verify before commit** - Always confirm the fix works
5. **No side effects** - Bug fixes should only fix the bug
