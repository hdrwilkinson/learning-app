---
name: branching
description: Git branching workflow and naming conventions. Part of Organization category (_hub-organization). Use when creating new branches, switching branches, or starting work on issues/features. Trigger phrases include "create branch", "new branch", "branch naming", "start feature", "checkout branch".
---

# Branching

## Purpose & Context (WHY)

**Problem**: Inconsistent branch naming makes project history difficult to navigate and understand.

**Solution**: Standardized branch naming convention that captures user, issue, type, and description.

**When to use**: Creating new branches, starting work on issues, or when asked about branch conventions.

## Branch Types

- `main` - Production branch, releases only
- `dev` - Active development branch, all PRs merge here first
- `feat/*` - Feature branches
- `fix/*` - Bug fix branches
- `chore/*` - Maintenance tasks, dependencies, etc.
- `etc/*` - Other branches

## Branch Naming Convention

Format: `[user]/[issue-number]-[type]([scope])/[description]`

**Components**:

- **User name**: Your identifier (e.g., `harry`)
- **Issue number**: GitHub issue number
- **Conventional commit type**: `feat`, `fix`, `chore`, `docs`, etc.
- **Scope**: Associated feature (e.g., `auth`, `ui`, `api`)
- **Extra tags**: Optional (e.g., `UI`, `UX`, `Functionality`)
- **Description**: Kebab-case description

**Example**: `harry/7-feat(auth-ui-ux)/email-and-password-authentication`

## Workflow

**Before creating a branch**:

1. Search for existing branches associated with the issue
2. If none exist, create new branch following naming convention

**Creating a branch**:

```bash
git checkout -b [user]/[issue]-[type]([scope])/[description]
```

## Key Principles

1. **Always include issue number** for traceability
2. **Use conventional commit types** for clarity
3. **Keep descriptions concise** but descriptive
4. **Check for existing branches** before creating new ones
