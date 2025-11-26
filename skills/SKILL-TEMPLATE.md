# Skill Template Structure

Every SKILL.md and step file follows this exact structure.

## SKILL.md Template

```markdown
---
name: [skill-name]
description: [One sentence - what and when]. Trigger phrases include "[trigger1]", "[trigger2]".
---

# [Skill Name]

## Purpose & Context (WHY)

[2-3 paragraphs explaining:]

- What problem this solves
- Why this approach vs. alternatives
- When to use vs. when to skip
- What makes this skill necessary

## Prerequisites

**Before starting**: Read `../TODO-SYSTEM.md` for TODO taxonomy and progression rules.

**Study examples**: [List 2-3 real examples to reference]

## TODO Summary

Create these [N] strategic TODOs:
```

[skill-name]-1: [5-8 word description]
[skill-name]-2: [5-8 word description]
[skill-name]-3: [5-8 word description]
...

```

## Workflow Steps (WHAT)

### Step 1: [Name]
**TODO**: `[skill-name]-1: [Description]`
**File**: `steps/01-[name].md`

**Actions**:
1. Mark TODO `in_progress`
2. Load step file
3. Execute (step file contains tactical sub-TODOs)
4. Verify completion criteria
5. Mark `completed` **only after verification**

**Completion Criteria**: [Specific conditions that must be true]

---

[Repeat for each step]

---

## Resources

**This Skill**:
- [Skill-specific resources]

**Other Skills Referenced**:
- [References to other skills like testing, debugging, etc.]

## Key Principles

[One sentence capturing the essence]
```

## Step File Template

```markdown
# Step [N]: [Name]

## Purpose & Context (WHY)

[1-2 paragraphs explaining:]

- What this step accomplishes
- Why it's necessary in the workflow
- What happens if you skip it

## Prerequisites

[What must be complete before this step]

## TODO Summary

Create these [N] tactical TODOs:
```

[skill-name]-[step].1: [5-8 word description]
[skill-name]-[step].2: [5-8 word description]
...

```

## Tactical Steps (HOW)

### [Subtask 1]
**TODO**: `[skill-name]-[step].1: [Description]`

**Actions**:
1. [Specific action]
2. [Specific action]
3. Verify: [What to check]
4. Mark `completed` **only after verification**

**Completion Criteria**: [Specific condition]

---

[Repeat for each subtask]

---

## Output

[What you should have when this step is complete]

**Next Step**: Load `steps/[next-number]-[next-name].md`
```

## Key Principles

1. **WHY before HOW**: Context before procedure
2. **SUMMARY before DETAILS**: TODO list at top, then expand each
3. **DRY**: Reference TODO-SYSTEM.md, don't repeat examples
4. **Completion Discipline**: Verify criteria before marking done
5. **Agile Understanding**: Explain purpose so AI can adapt when needed

---

## Hub Skill Template

Hub skills orchestrate related sub-skills within a category. They don't execute workflows themselves - they route to the appropriate sub-skill.

```markdown
---
name: _hub-[category]
description: [Category] skills hub. Routes to specific skills for [list main activities]. Use when unsure which [category] skill to use.
---

# [Category] Skills Hub

## Purpose

This hub helps you choose the right skill for [category]-related tasks. It provides:

- **Decision tree**: Which skill do I need?
- **Cross-skill workflows**: Common multi-skill patterns
- **Category context**: Shared principles for this domain

## Decision Tree

| If you need to... | Use this skill |
| ----------------- | -------------- |
| [Task 1]          | `skill-a`      |
| [Task 2]          | `skill-b`      |
| [Task 3]          | `skill-c`      |

## Sub-Skills in This Category

### skill-a

**Use when**: [Specific trigger conditions]

**Path**: `/skills/skill-a/SKILL.md`

---

### skill-b

**Use when**: [Specific trigger conditions]

**Path**: `/skills/skill-b/SKILL.md`

---

## Cross-Skill Workflows

### [Common Workflow Name]

When [scenario], combine skills in this order:

1. **skill-a**: [What to do with it]
2. **skill-b**: [What to do with it]

## Category Principles

1. **[Principle 1]**: [Explanation]
2. **[Principle 2]**: [Explanation]
```

---

## Examples from This Project

### Simple Skill (Single SKILL.md)

See `skills/branching/SKILL.md` - complete workflow in one file, no step files needed.

### Reference-Heavy Skill

See `skills/branding/SKILL.md` - lean SKILL.md with details in `reference/` files.

### Multi-Step Skill

See `skills/add-skill/SKILL.md` - 6 strategic steps with individual step files.

### Hub Skill (Category Orchestrator)

See `skills/_hub-organization/SKILL.md` - routes to branching, issue-management, pushing-code, code-review.

---

_Template established November 2025 for the Learning App (Cognia) project._
