---
name: [skill-name]
description:
    [
        COMPREHENSIVE description - this is the PRIMARY TRIGGER. Include: what skill does,
        when to use it,
        specific trigger phrases,
        use cases. Make this >50 words and include ALL conditions that should trigger the skill. Example: "Create X for Y. Use when users need to [scenarios]. Trigger phrases: 'keyword1', 'keyword2', 'pattern3'.",
    ]
---

# [Skill Name]

## Purpose & Context (WHY)

**Problem**: [What pain point does this skill solve? Why does this need to exist?]

**Solution**: [How does this skill address the problem? What approach does it take?]

**Context**: [When to use this skill vs other approaches? When to skip it?]

**CRITICAL FILE READING RULE**: When skill instructions reference template files, reference files, or any skill documentation, you MUST read the ENTIRE file (not partial reads). Never use offset/limit parameters when reading templates, references, or skill step files.

## Prerequisites

**Study proven patterns**: [List 2-3 existing skills to study as examples]

## TODO Summary

Create these [N] strategic TODOs:

```
[skill-name]-1: [5-8 word description of step 1]
[skill-name]-2: [5-8 word description of step 2]
[skill-name]-3: [5-8 word description of step 3]
...
```

## Workflow Steps (WHAT & HOW)

### Step 1: [Step Name]

**TODO**: `[skill-name]-1: [description]`

**File**: `steps/01-[name].md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/01-[name].md` for tactical workflow
3. Execute step procedures [brief description]
4. Verify: [specific completion condition]
5. Mark `completed` **only after verification**

**Completion Criteria**: [Specific conditions that must be true]

---

### Step 2: [Step Name]

**TODO**: `[skill-name]-2: [description]`

**File**: `steps/02-[name].md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/02-[name].md` for tactical workflow
3. Execute step procedures [brief description]
4. Verify: [specific completion condition]
5. Mark `completed` **only after verification**

**Completion Criteria**: [Specific conditions that must be true]

---

[Repeat for each step]

---

## Resources

**This Skill**:

- Steps: `steps/` ([list step files])
- [Scripts: `scripts/` ([list if any])]
- [Templates: `templates/` ([list if any])]
- [References: `reference/` ([list])]
- [Assets: `assets/` ([list if any])]

**Related Skills**:

- `[skill-name]` - [brief description of relationship]

## Key Principles

1. **[Principle 1]**: [One sentence capturing key pattern]
2. **[Principle 2]**: [One sentence capturing key pattern]
3. **[Principle 3]**: [One sentence capturing key pattern]
4. **[Principle 4]**: [One sentence capturing key pattern]
5. **[Principle 5]**: [One sentence capturing key pattern]

---

## Template Usage Notes

**What to include**:

- YAML description: COMPREHENSIVE trigger info (PRIMARY TRIGGERING MECHANISM)
- Purpose & Context: WHY skill exists (2-3 paragraphs, concise)
- Prerequisites: Skills to study as examples
- TODO Summary: Strategic TODOs matching steps
- Workflow Steps: Overview with MANDATORY directives
- Resources: All bundled files
- Key Principles: 5-10 concise bullets

**What to remember**:

- Keep SKILL.md < 500 lines (target: 300-400)
- Use **MANDATORY** directives in every step
- Include completion criteria for verification
- Challenge every token: "Does Claude really need this?"
- Move details to references/ if approaching line limit

**Progressive disclosure**:

- Metadata (description): Always loaded (~100 words)
- SKILL.md body: Loaded when skill triggers (<500 lines)
- Bundled resources: Loaded as-needed (unlimited)

**Delete this "Template Usage Notes" section when creating actual skill.**
