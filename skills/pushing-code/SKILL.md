---
name: pushing-code
description: Git commit and push workflow with conventional commit standards. Part of Organization category (_hub-organization). Use when committing changes, pushing to remote, or writing commit messages. Trigger phrases include "commit", "push code", "git push", "commit message", "push changes".
---

# Pushing Code

## Purpose & Context (WHY)

**Problem**: Inconsistent commit messages make project history difficult to understand and navigate.

**Solution**: Conventional commit standards with clear structure and issue references.

**When to use**: Ready to commit and push changes to the remote repository.

## Commit Message Format

Use imperative mood and conventional commit standards:

```
[type]([scope]): [description] (#[issue-number])

[Optional body - additional details]
```

### Commit Types

| Type       | Usage                                   |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `docs`     | Documentation only                      |
| `style`    | Formatting, no code change              |
| `refactor` | Code change that neither fixes nor adds |
| `perf`     | Performance improvement                 |
| `test`     | Adding or updating tests                |
| `chore`    | Maintenance, dependencies               |

### Rules

- **Imperative mood**: "add validation" not "added validation"
- **Reference issue**: `(#ISSUE_NUMBER)` in title
- **Brief summary**: Clear and concise description
- **Update issue**: Add relevant comments to the GitHub issue thread

## Workflow

```bash
# Check current branch
git rev-parse --abbrev-ref HEAD

# Stage changes
git add [files]

# Commit with message
git commit -m "feat(feature): title for commit (#issue-number)" \
           -m "Additional information n_1" \
           -m "Additional information n_2"

# Push to remote
git push origin [branch-name]
```

## Examples

**Feature commit**:

```
feat(auth): implement OAuth authentication (#12)

- Add Google OAuth provider
- Add GitHub OAuth provider
- Update auth middleware
```

**Bug fix**:

```
fix(api): correct date formatting in reports (#45)

Use UTC timestamps consistently across report generation
```

**Chore**:

```
chore(deps): update dependencies (#78)
```

## Important Notes

- Don't use MCP for `git add`, `commit`, and `push` - use Cursor's native tools
- Update the related GitHub issue with relevant comments
- Run pre-commit checks before pushing

## Key Principles

1. **Clear commit messages** enable project history understanding
2. **Issue references** maintain traceability
3. **Atomic commits** - one logical change per commit
4. **Imperative mood** - describes what the commit does
5. **Update issues** - keep stakeholders informed
