# Learning App Skills

This directory contains [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - organized modules of procedural knowledge that agents load dynamically to perform specialized tasks.

## The Core Concept: Progressive Disclosure

We use the official **Progressive Disclosure** architecture defined by Anthropic to solve complex tasks without overwhelming the context window.

### The 3 Levels of Disclosure

1.  **Level 1: Metadata (The Index)**
    - **What**: `name` and `description` from YAML frontmatter.
    - **Where**: Pre-loaded into the agent's system prompt (via `.cursor/rules/skills-registry.mdc`).
    - **Cost**: Very Low (~100 tokens).
    - **Role**: "I know this skill exists."

2.  **Level 2: The Manager (`SKILL.md`)**
    - **What**: The strategic roadmap and high-level workflow.
    - **Where**: Loaded _only_ when the agent decides to use the skill.
    - **Cost**: Medium (~500 tokens).
    - **Role**: "I know the plan."

3.  **Level 3: The Worker (`steps/*.md` & `scripts/`)**
    - **What**: Tactical checklists, templates, and executable code.
    - **Where**: Loaded on-demand for specific steps, then discarded.
    - **Cost**: High (but temporary).
    - **Role**: "I am doing the work."

---

## Anatomy of a Skill

A skill is a self-contained directory (e.g., `/skills/testing/`) acting as a procedural memory module.

```
skills/testing/
├── SKILL.md              # Level 2: Strategy & Roadmap
├── steps/                # Level 3: Tactical checklists (The "Workers")
│   ├── 01-setup.md
│   ├── 02-write-tests.md
│   └── ...
├── templates/            # Level 3: Blueprints & Boilerplate
├── reference/            # Level 3: Guidelines & Standards
└── scripts/              # Level 3: Deterministic Code (Python/Bash)
```

### Code Execution (`scripts/`)

Skills should include **executable code** for deterministic tasks.

- **Use Code For**: Validating file structures, generating boilerplate, running checks.
- **Use LLM For**: Writing content, reasoning, decision making.
- _Example_: The `add-skill` skill uses `scripts/validate_skill.py` to validate skill structure.

---

## Execution Lifecycle

When an agent executes a skill, it follows this strict loop:

1.  **Trigger**: Agent recognizes intent → checks Level 1 Metadata → loads Level 2 `SKILL.md`.
2.  **Plan**: Agent reads `SKILL.md` and writes the Strategic TODOs to memory.
3.  **Step Loop**:
    - **Load**: Agent reads the current Level 3 `steps/NN-name.md` file.
    - **Execute**: Agent performs the tactical sub-tasks (using templates/scripts).
    - **Verify**: Agent checks "Completion Criteria" explicitly.
    - **Complete**: Agent marks the Strategic TODO as done.
    - **Unload**: Agent proceeds to the next step (effectively "forgetting" the previous step's details).

---

## Hub Skills Architecture

Skills are organized into **categories** using **Hub Skills**. A hub is a lightweight orchestration skill that:

- Provides category overview and context
- Helps choose the right sub-skill for your task
- Documents cross-skill workflows within the category
- Routes to specific sub-skills for detailed execution

### How Hubs Work

```
User Request: "I need to review a PR"
    ↓
Agent checks Level 1 Metadata
    ↓
Matches: _hub-organization (planning & workflow category)
    ↓
Agent loads hub SKILL.md → Decision tree points to: code-review
    ↓
Agent loads code-review/SKILL.md → Executes detailed workflow
```

**Hub naming**: Prefixed with `_hub-` so they sort to top and are clearly distinguishable.

### Available Hubs

| Hub                   | Category             | Sub-skills                                             |
| --------------------- | -------------------- | ------------------------------------------------------ |
| `_hub-organization`   | Planning & Workflow  | branching, issue-management, pushing-code, code-review |
| `_hub-quality`        | Code Quality         | debugging, testing, linting, refactoring               |
| `_hub-frontend`       | Frontend Development | branding, components, accessibility, animations        |
| `_hub-backend`        | Backend Development  | api-design, database, authentication, validation       |
| `_hub-infrastructure` | DevOps & Deployment  | deployment, performance                                |

---

## Available Skills

### Meta Skills

#### add-skill

**Description**: Create new skills for this project. Unified methodology combining progressive disclosure, mandatory loading directives, and proven step-based workflows.

**Use when**: Extending the codebase with new capabilities - "create a skill for [X]", "add [X] skill", workflow automation needs

**Structure**:

- `steps/`: 6-step workflow (understand → plan → structure → write → implement → register)
- `templates/`: Skill template structure
- `reference/`: Best practices, progressive disclosure guidelines
- `scripts/`: Skill validation script

**Key concept**: Progressive disclosure + mandatory loading = efficient, reliable skills

**Path**: `/skills/add-skill/`
**Level 1 Trigger**: "create skill", "add skill", "new skill for"

---

### Organization & Workflow Skills

#### branching

**Description**: Git branching workflow and naming conventions.

**Use when**: Creating new branches, switching branches, starting work on issues/features

**Structure**:

- Single `SKILL.md` with complete workflow
- Branch naming convention: `[user]/[issue-number]-[type]([scope])/[description]`

**Key concept**: Consistent branch naming enables clear project history

**Path**: `/skills/branching/`
**Level 1 Trigger**: "create branch", "new branch", "branch naming", "start feature"

---

#### issue-management

**Description**: GitHub issue creation and workflow management.

**Use when**: Creating new GitHub issues, starting work on existing issues, planning features

**Structure**:

- Single `SKILL.md` with issue structure and workflow
- Title format: `[type]([scope]): [descriptive title]`

**Key concept**: Well-defined issues enable efficient development

**Path**: `/skills/issue-management/`
**Level 1 Trigger**: "create issue", "new issue", "start issue", "github issue"

---

#### pushing-code

**Description**: Git commit and push workflow with conventional commit standards.

**Use when**: Committing changes, pushing to remote, writing commit messages

**Structure**:

- Single `SKILL.md` with commit format and workflow
- Format: `[type]([scope]): [description] (#[issue-number])`

**Key concept**: Clear commit messages enable project history understanding

**Path**: `/skills/pushing-code/`
**Level 1 Trigger**: "commit", "push code", "git push", "commit message"

---

#### code-review _(NEW)_

**Description**: PR review patterns, feedback guidelines, and code review best practices.

**Use when**: Reviewing pull requests, providing feedback, approving changes

**Structure**:

- `SKILL.md`: Review workflow and checklist
- `reference/`: Review patterns, feedback templates

**Key concept**: Constructive reviews improve code quality and team knowledge

**Path**: `/skills/code-review/`
**Level 1 Trigger**: "review PR", "code review", "pull request feedback"

---

### Code Quality Skills

#### debugging

**Description**: Systematic debugging approach for fixing errors and bugs.

**Use when**: Errors occur in code, tests fail, issues need investigation

**Structure**:

- Single `SKILL.md` with complete workflow
- 5-step process: Reproduce → Isolate → Understand → Fix → Verify

**Key concept**: Understand the root cause before attempting fixes

**Path**: `/skills/debugging/`
**Level 1 Trigger**: "debug", "fix error", "test failing", "investigate bug"

---

#### testing

**Description**: Testing guidelines for Jest (unit/integration) and Playwright (E2E).

**Use when**: Writing tests, implementing test coverage, fixing test failures

**Structure**:

- `SKILL.md`: Overview and quick reference
- `reference/jest-patterns.md`: Jest examples and patterns
- `reference/playwright-patterns.md`: Playwright examples

**Key concept**: Test functionality, not implementation details

**Path**: `/skills/testing/`
**Level 1 Trigger**: "write tests", "add tests", "jest", "playwright", "unit test", "e2e test"

---

#### linting _(NEW)_

**Description**: ESLint, TypeScript, and Prettier configuration and patterns.

**Use when**: Fixing linting errors, configuring code style, TypeScript issues

**Structure**:

- `SKILL.md`: Quick reference for common issues
- `reference/`: ESLint rules, TypeScript patterns

**Key concept**: Consistent code style reduces cognitive load

**Path**: `/skills/linting/`
**Level 1 Trigger**: "lint error", "eslint", "typescript error", "prettier"

---

#### refactoring _(NEW)_

**Description**: Safe code restructuring patterns and extract methods.

**Use when**: Improving code structure without changing behavior

**Structure**:

- `SKILL.md`: Refactoring workflow
- `reference/`: Common refactoring patterns

**Key concept**: Small, verified changes maintain stability

**Path**: `/skills/refactoring/`
**Level 1 Trigger**: "refactor", "extract", "restructure code", "clean up"

---

### Frontend Development Skills

#### branding

**Description**: Complete brand guidelines for Cognia - visual identity, design tokens, component styles, and brand voice.

**Use when**: Building UI components, choosing colors, typography decisions, design consistency

**Structure**:

- `SKILL.md`: Quick reference for colors, typography, spacing
- `reference/color-tokens.md`: Complete color system
- `reference/typography.md`: Typography and spacing details

**Key concept**: Design tokens are the single source of truth across platforms

**Path**: `/skills/branding/`
**Level 1 Trigger**: "brand colors", "design tokens", "typography", "UI styling"

---

#### components _(NEW)_

**Description**: UI component patterns using shadcn/ui and atomic design.

**Use when**: Building new components, organizing component structure, UI patterns

**Structure**:

- `SKILL.md`: Component workflow
- `reference/`: shadcn patterns, atomic design principles

**Key concept**: Composable, accessible components from atoms to organisms

**Path**: `/skills/components/`
**Level 1 Trigger**: "create component", "shadcn", "atomic design", "UI component"

---

#### accessibility _(NEW)_

**Description**: WCAG compliance, ARIA patterns, and keyboard navigation.

**Use when**: Ensuring accessibility, adding ARIA labels, keyboard support

**Structure**:

- `SKILL.md`: Accessibility checklist
- `reference/`: WCAG guidelines, ARIA patterns

**Key concept**: Accessible by default, not as an afterthought

**Path**: `/skills/accessibility/`
**Level 1 Trigger**: "accessibility", "a11y", "ARIA", "keyboard navigation", "screen reader"

---

#### animations _(NEW)_

**Description**: Motion design with Tailwind transitions and animation patterns.

**Use when**: Adding animations, transitions, micro-interactions

**Structure**:

- `SKILL.md`: Animation principles
- `reference/`: Tailwind animation classes, spring physics

**Key concept**: Purposeful motion enhances UX without distraction

**Path**: `/skills/animations/`
**Level 1 Trigger**: "animation", "transition", "motion", "animate"

---

### Backend Development Skills

#### api-design _(NEW)_

**Description**: Route handlers, server actions, and REST API patterns for Next.js.

**Use when**: Creating API endpoints, server actions, data fetching

**Structure**:

- `SKILL.md`: API design workflow
- `reference/`: Route handler patterns, server action examples

**Key concept**: Predictable APIs with proper error handling and validation

**Path**: `/skills/api-design/`
**Level 1 Trigger**: "API endpoint", "route handler", "server action", "REST API"

---

#### database _(NEW)_

**Description**: Prisma schema design, migrations, queries, and relations.

**Use when**: Database operations, schema changes, complex queries

**Structure**:

- `SKILL.md`: Database workflow
- `reference/`: Prisma patterns, query optimization

**Key concept**: Schema-first design with type-safe queries

**Path**: `/skills/database/`
**Level 1 Trigger**: "prisma", "database", "migration", "schema", "query"

---

#### authentication _(NEW)_

**Description**: Auth.js patterns, sessions, OAuth, and credentials.

**Use when**: Implementing auth, session management, OAuth providers

**Structure**:

- `SKILL.md`: Auth workflow
- `reference/`: Auth.js patterns, provider setup

**Key concept**: Secure authentication with proper session handling

**Path**: `/skills/authentication/`
**Level 1 Trigger**: "auth", "login", "session", "OAuth", "authentication"

---

#### validation _(NEW)_

**Description**: Zod schemas for form validation and API validation.

**Use when**: Input validation, form handling, API request validation

**Structure**:

- `SKILL.md`: Validation patterns
- `reference/`: Zod schemas, error handling

**Key concept**: Validate at boundaries, trust internal code

**Path**: `/skills/validation/`
**Level 1 Trigger**: "validation", "zod", "form validation", "input validation"

---

### Infrastructure & DevOps Skills

#### deployment _(NEW)_

**Description**: Vercel deployment, environment variables, and build optimization.

**Use when**: Deploying to production, configuring environment, build issues

**Structure**:

- `SKILL.md`: Deployment workflow
- `reference/`: Vercel patterns, env configuration

**Key concept**: Reproducible deployments with proper environment isolation

**Path**: `/skills/deployment/`
**Level 1 Trigger**: "deploy", "vercel", "environment variables", "production"

---

#### performance _(NEW)_

**Description**: Performance optimization, caching, lazy loading, and bundle size.

**Use when**: Improving performance, reducing bundle size, caching strategies

**Structure**:

- `SKILL.md`: Performance workflow
- `reference/`: Optimization patterns, measurement tools

**Key concept**: Measure first, optimize where it matters

**Path**: `/skills/performance/`
**Level 1 Trigger**: "performance", "optimize", "bundle size", "caching", "lazy load"

---

## TODO Taxonomy & Standardization

**Complete Specification**: See `TODO-SYSTEM.md` for:

- Format specification with examples from all skills
- Status progression rules (CRITICAL: mark `completed` only after work done)
- Cross-skill TODO management
- Hierarchy visualization

**Skill Template**: See `SKILL-TEMPLATE.md` for standardized structure that all skills follow.

### Quick Reference

**Format**: `[skill-name]-[step].[subtask]: [5-8 word description]`

**Examples**:

- `add-skill-1: Understand skill with concrete examples`
- `testing-1.1: Set up Jest configuration`
- `debugging-3: Understand the error and root cause`

**Key Rules**:

1. Include skill name (prevents collisions)
2. Use decimal notation for hierarchy (1.1, 1.2, not 1-a, 1-b)
3. Descriptive (5-8 words, actionable, specific)
4. Mark `completed` ONLY after work verified

---

## How to Use Skills

### For AI Agents (Cursor, Claude)

When you encounter a task that matches a skill:

1. Read the skill's `SKILL.md` file
2. Follow the workflow described
3. Load additional files only as needed (progressive disclosure)
4. Reference templates and examples when building

**Example**:

```bash
# When asked to create a branch
cat /Users/hdrwilkinson/Desktop/git/Harry/learning-app/skills/branching/SKILL.md
# Follow branch naming convention
```

### For Humans

Skills serve as procedural documentation. Read the SKILL.md to understand the workflow, then dive into specific files as needed.

---

## How to Create a New Skill

### 1. Conceptualize the Workflow

Break your task into 3-5 distinct phases.

- _Rule of Thumb_: If a step has more than 8 sub-tasks, split it.
- _Rule of Thumb_: Use code (`scripts/`) for anything that requires validation or strict structure.

### 2. Scaffold the Directory

```bash
mkdir skills/my-new-skill
mkdir skills/my-new-skill/steps
mkdir skills/my-new-skill/templates
mkdir skills/my-new-skill/reference
mkdir skills/my-new-skill/scripts # Optional but recommended
```

### 3. Create the Manager (`SKILL.md`)

Copy `skills/SKILL-TEMPLATE.md`. Define the **Strategic TODOs** and **YAML Frontmatter**.

```yaml
---
name: my-new-skill
description: One sentence explanation of what this skill does. Trigger phrases include "trigger1", "trigger2".
---

# [Skill Name]

## Purpose & Context (WHY)

[Overview paragraph]

## When to Use
Trigger when:
- [Specific condition 1]
- [Specific condition 2]

## Core Workflow
[High-level steps with references to bundled files]
```

### 4. Create the Workers (`steps/*.md`)

Create a markdown file for each Strategic TODO.

- Include specific **Tactical TODOs**.
- Define explicit **Completion Criteria**.

### 5. Register the Skill

**CRITICAL**: Add your skill to `.cursor/rules/skills-registry.mdc`.

- This populates the **Level 1 Metadata** in the agent's system prompt.

```markdown
### [skill-name]

**Trigger**: [When to use this skill]
**Path**: `/skills/[skill-name]/SKILL.md`
**Description**: [What it does]
```

### 6. Test the Skill

- Try using the skill for its intended purpose
- Verify progressive disclosure works (only loading what's needed)
- Check that references and templates are accurate
- Update based on real usage

---

## Best Practices

**From Anthropic's Guidelines**:

1. **Start with evaluation**: Identify gaps in agent capabilities, then build skills to address them
2. **Structure for scale**: Split large SKILL.md files into separate referenced files
3. **Think from Claude's perspective**: Monitor how Claude uses skills, iterate based on observations
4. **Iterate with Claude**: Ask Claude to capture successful approaches into reusable context

**From Our Experience**:

1. **Keep SKILL.md lean**: ~500 tokens, reference other files
2. **Organize logically**: Steps → Templates → Reference pattern works well
3. **Use real examples**: Include actual workflows from the project
4. **No redundancy**: If info is in skill, don't duplicate in Cursor rules
5. **Update registry**: Always add new skills to skills-registry.mdc
6. **Code over Text**: Use bundled scripts for deterministic operations
7. **Explicit reference loading**: Use "**MANDATORY**" and "**BEFORE YOU PROCEED**" directives

### Reference Linking Best Practices

**Problem**: Agents skip loading reference files unless explicitly directed.

**Solution**: Use strong directive language at file boundaries.

**In SKILL.md** (for step files):

```markdown
**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/02-write-tests.md` for tactical workflow
3. Execute...
```

**In step files** (for reference files):

```markdown
**BEFORE YOU PROCEED**: Read `../reference/jest-patterns.md` to understand:

- Test patterns
- Mock setup

**Actions**:

1. **MANDATORY**: Load `../reference/jest-patterns.md` NOW (don't skip this)
2. Use the patterns from that file to write tests
```

**Key**: Use both blocker text ("BEFORE YOU PROCEED") AND action command ("MANDATORY: Load NOW") to ensure files are loaded at the right time.

---

## Skill Maintenance

### When to Update a Skill

- New patterns emerge from real usage
- Better approach discovered
- Templates need refinement
- Examples become outdated

### How to Update

1. Edit relevant files in skill directory
2. Keep SKILL.md lean (move details to reference files if growing)
3. Add new examples from real usage
4. Update version/date in SKILL.md if major changes

### Versioning

Not formalized yet - update in place for now. Consider adding version to YAML frontmatter if skills become complex.

---

## Skills Directory Structure

```
skills/
├── README.md (this file)
├── SKILL-TEMPLATE.md
├── TODO-SYSTEM.md
│
├── _hub-organization/          # Hub: Planning & Workflow
│   └── SKILL.md
├── _hub-quality/               # Hub: Code Quality
│   └── SKILL.md
├── _hub-frontend/              # Hub: Frontend Development
│   └── SKILL.md
├── _hub-backend/               # Hub: Backend Development
│   └── SKILL.md
├── _hub-infrastructure/        # Hub: DevOps & Deployment
│   └── SKILL.md
│
├── add-skill/                  # Meta: Skill creation
│   ├── SKILL.md
│   ├── steps/
│   ├── templates/
│   ├── reference/
│   └── scripts/
│
├── branching/                  # Organization
├── issue-management/           # Organization
├── pushing-code/               # Organization
├── code-review/                # Organization
│
├── debugging/                  # Quality
├── testing/                    # Quality
│   └── reference/
├── linting/                    # Quality
├── refactoring/                # Quality
│
├── branding/                   # Frontend
│   └── reference/
├── components/                 # Frontend
├── accessibility/              # Frontend
├── animations/                 # Frontend
│
├── api-design/                 # Backend
├── database/                   # Backend
├── authentication/             # Backend
├── validation/                 # Backend
│
├── deployment/                 # Infrastructure
└── performance/                # Infrastructure
```

---

## Reference

**Anthropic Documentation**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills

**Anthropic Skills Docs**: Check docs.anthropic.com for latest skills documentation

---

_Skills directory established November 2025, reorganized with hub architecture November 26, 2025 for the Learning App (Cognia) project._
