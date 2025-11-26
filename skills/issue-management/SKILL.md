---
name: issue-management
description: GitHub issue creation and workflow management. Part of Organization category (_hub-organization). Use when creating new issues, starting work on existing issues, or planning features. Trigger phrases include "create issue", "new issue", "start issue", "work on issue", "github issue", "feature request", "bug report".
---

# Issue Management

## Purpose & Context (WHY)

**Problem**: Poorly structured issues lead to unclear requirements and wasted development time.

**Solution**: Standardized issue structure and workflow for creating and starting work on issues.

**When to use**: Creating new GitHub issues or starting work on existing ones.

## Creating Issues

### Issue Structure

**Title Format**: `[type]([scope]): [descriptive title]`

Examples:

- `feat(auth): Implement OAuth Authentication (Google & GitHub)`
- `fix(api): Resolve race condition in session handling`
- `chore(deps): Update Next.js to v15`

### Issue Components

1. **Type** (from conventional commits): `feat`, `fix`, `docs`, `chore`, etc.
2. **Scope**: Feature area it relates to
3. **Descriptive title**: Clear, concise summary

### Issue Body Requirements

- **Description**: Detailed explanation of the feature/bug
- **Acceptance Criteria**: Clearly defined, specific conditions for completion
- **Edge Cases**: Explicitly identified and documented
- **Labels**: Appropriate categorization
- **Assignee**: Assign to `hdrwilkinson`

### Issue Creation Workflow

1. Use iterative Q&A to understand the desired functionality or fix
2. Create the issue in GitHub (via MCP or manually)
3. Be as descriptive and detailed as possible
4. Include all acceptance criteria
5. Add appropriate labels

## Starting Work on Issues

### Before Starting

1. **Read the issue** description and all comments thoroughly
2. **Search the codebase** to understand the context and related code
3. **Create a branch** following the [branching skill](../branching/SKILL.md) conventions

### Starting Workflow

1. Read and understand the full issue
2. Search codebase for related code
3. Create appropriately named branch
4. Begin implementation

## Issue Labels

Common labels to apply:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation only changes
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high/medium/low` - Priority level

## Example Issue

```markdown
## Description

[Detailed explanation of what needs to be done]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Edge Cases

- Edge case 1: How to handle X
- Edge case 2: What happens when Y

## Technical Notes

[Any relevant technical context]
```

## Key Principles

1. **Clear acceptance criteria** - Specific, testable conditions
2. **Document edge cases** - Prevent surprises during implementation
3. **Be descriptive** - More detail is better than less
4. **Read before starting** - Understand the full context
5. **Search the codebase** - Know what exists before building
