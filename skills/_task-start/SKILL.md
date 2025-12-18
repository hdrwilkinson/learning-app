# Task Start - Skill Router

> **Meta-skill for task initiation. Ensures appropriate skills are loaded before implementation begins.**

## Purpose

This skill runs at the **start of any multi-step task** to:

1. Route to the appropriate skill(s) for the task
2. Ensure consistent quality through skill-guided workflows
3. Prevent "ad-hoc" implementation that misses best practices

## When This Skill Triggers

**MANDATORY** for:

- Any feature implementation
- Bug fixes requiring multiple files
- Database/schema changes
- Component creation
- API endpoint creation
- Git workflow operations (branch, commit, PR)

**Skip** for:

- Simple one-line fixes
- Answering questions (no code changes)
- Reading/exploring code only

---

## Workflow

### Step 1: Categorize the Task

Determine which category best matches the task:

| Category           | Hub Skill             | Example Tasks                                  |
| ------------------ | --------------------- | ---------------------------------------------- |
| **Organization**   | `_hub-organization`   | Branches, issues, commits, PRs                 |
| **Quality**        | `_hub-quality`        | Debugging, testing, linting, refactoring       |
| **Frontend**       | `_hub-frontend`       | Components, styling, accessibility, animations |
| **Backend**        | `_hub-backend`        | APIs, database, auth, validation, AI/chat      |
| **Infrastructure** | `_hub-infrastructure` | Deployment, performance                        |

### Step 2: Load the Hub Skill

Read the hub skill for your category:

```
skills/_hub-{category}/SKILL.md
```

The hub skill provides:

- Decision tree for sub-skill selection
- Cross-skill workflows
- Category-specific principles

### Step 3: Select Specific Skill(s)

Based on hub guidance, identify which specific skills apply:

**Common patterns:**

| Task                      | Skills to Load                  |
| ------------------------- | ------------------------------- |
| Create React component    | `components` + `branding`       |
| Add API endpoint          | `api-design` + `validation`     |
| Fix a bug                 | `debugging` → then domain skill |
| Database migration        | `database`                      |
| Implement chat/AI feature | `ai-sdk` + `api-design`         |
| Create new branch         | `branching`                     |
| Commit and push           | `pushing-code`                  |

### Step 4: Load and Follow Skill Workflow

For each applicable skill:

1. **Read the SKILL.md** file completely
2. **Create TODOs** from the skill's workflow
3. **Follow the workflow** step by step
4. **Cite skill usage**: "Following [skill-name] workflow..."

---

## Quick Reference: All Skills

### Meta Skills

- `add-skill` - Create new skills

### Organization

- `branching` - Git branch workflow
- `issue-management` - GitHub issues
- `pushing-code` - Commits and pushes
- `code-review` - PR reviews

### Quality

- `debugging` - Bug investigation
- `testing` - Jest and Playwright
- `linting` - ESLint, TypeScript, Prettier
- `refactoring` - Code restructuring

### Frontend

- `branding` - Design tokens, colors, typography
- `components` - UI component patterns
- `accessibility` - WCAG, ARIA, keyboard nav
- `animations` - Motion design

### Backend

- `api-design` - Route handlers, server actions
- `database` - Prisma schema, migrations
- `authentication` - Auth.js patterns
- `validation` - Zod schemas
- `ai-sdk` - AI SDK v6, chat, agents, tools

### Infrastructure

- `deployment` - Vercel deployment
- `performance` - Optimization

---

## Key Principle

**Skills encode best practices. Using them consistently ensures quality.**

When in doubt, start with the hub skill for your category. The hub will route you to the right specific skill(s).
