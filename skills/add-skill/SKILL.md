---
name: add-skill
description: Create new skills for this project. Use when extending the codebase with new capabilities (workflow automation, documentation patterns, development processes, etc.). Provides unified methodology combining progressive disclosure, mandatory loading directives, and proven step-based workflows. Trigger phrases include "create a skill", "add skill", "new skill for", "extend with skill".
---

# Add Skill

## Purpose & Context (WHY)

**Problem**: Creating skills ad-hoc leads to inconsistencies—some use progressive disclosure well, others have bloated SKILL.md files; some enforce file loading, others hope LLMs read references; some verify completion, others mark tasks done prematurely.

**Solution**: Unified methodology synthesizing Anthropic's proven patterns (progressive disclosure, context efficiency, bundled resources) with validated approaches (mandatory loading directives, complete file reads, verification before completion).

**Context window is a public good.** Skills share context with system prompts, conversation history, and user requests. Default assumption: **Claude is already very smart**—only add what Claude genuinely needs.

**When to create a skill**:

- Repetitive multi-step workflows (>3 distinct phases)
- Complex domain knowledge (API integrations, specialized formats)
- Deterministic operations (scripts prevent code rewriting)
- Specialized tool usage patterns (testing workflows, deployment processes)

**When NOT to create a skill**:

- Simple one-off tasks (just implement directly)
- Pure documentation (add to existing reference files)
- Temporary workflows (will change frequently)

**CRITICAL FILE READING RULE**: When skill instructions reference template files, reference files, or any skill documentation, you MUST read the ENTIRE file (not partial reads). Never use offset/limit parameters when reading templates, references, or skill step files.

## Prerequisites

**Study proven patterns** (once available):

- `branching` - Git workflow skill example
- `testing` - Progressive disclosure with reference file organization
- `branding` - Reference-heavy skill with detailed tokens

## TODO Summary

Create these 6 strategic TODOs:

```
add-skill-1: Understand skill with concrete examples
add-skill-2: Plan reusable resources (scripts, references, assets)
add-skill-3: Create directory structure and initialize files
add-skill-4: Write SKILL.md with comprehensive description
add-skill-5: Implement bundled resources with tests
add-skill-6: Register skill and verify triggering
```

## Workflow Steps (WHAT & HOW)

### Step 1: Understand with Concrete Examples

**TODO**: `add-skill-1: Understand skill with concrete examples`

**File**: `steps/01-understand-examples.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/01-understand-examples.md` for tactical workflow
3. Execute step procedures (ask user for examples, generate scenarios, identify triggers)
4. Verify: You have 3-5 concrete use cases documented
5. Mark `completed` **only after verification**

**Completion Criteria**: Clear understanding of skill functionality with specific trigger phrases and representative examples

---

### Step 2: Plan Reusable Resources

**TODO**: `add-skill-2: Plan reusable resources (scripts, references, assets)`

**File**: `steps/02-plan-resources.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/02-plan-resources.md` for tactical workflow
3. The step file will guide you through resource planning with degrees of freedom framework
4. Verify: You have clear list of scripts/, references/, and assets/ to create
5. Mark `completed` **only after verification**

**Completion Criteria**: Resource plan complete—know exactly which scripts (deterministic tasks), references (docs to load), and assets (output files) to create

---

### Step 3: Create Directory Structure

**TODO**: `add-skill-3: Create directory structure and initialize files`

**File**: `steps/03-create-structure.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/03-create-structure.md` for tactical workflow
3. Create `skills/[name]/` with subdirectories
4. Initialize SKILL.md with frontmatter
5. Mark `completed` **only after verification**

**Completion Criteria**: Directory exists, SKILL.md initialized, subdirectories created as planned

---

### Step 4: Write SKILL.md

**TODO**: `add-skill-4: Write SKILL.md with comprehensive description`

**File**: `steps/04-write-skill-md.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/04-write-skill-md.md` for tactical workflow
3. The step file directs loading of templates/skill-template.md and reference/best-practices.md
4. Write SKILL.md following proven structure
5. Verify: Description comprehensive, under 500 lines, MANDATORY directives present
6. Mark `completed` **only after verification**

**Completion Criteria**: SKILL.md complete with comprehensive YAML description (PRIMARY TRIGGER), clear workflow steps, and proper MANDATORY directives

---

### Step 5: Implement Bundled Resources

**TODO**: `add-skill-5: Implement bundled resources with tests`

**File**: `steps/05-add-resources.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/05-add-resources.md` for tactical workflow
3. Implement scripts/ (test by running them)
4. Write references/ documentation
5. Add assets/ templates
6. Reference all resources from SKILL.md with MANDATORY directives
7. Mark `completed` **only after verification**

**Completion Criteria**: All planned resources implemented, scripts tested and working, resources properly referenced from SKILL.md

---

### Step 6: Register and Verify

**TODO**: `add-skill-6: Register skill and verify triggering`

**File**: `steps/06-register-verify.md`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `steps/06-register-verify.md` for tactical workflow
3. Add skill to `.cursor/rules/skills-registry.mdc`
4. Run validation script
5. Test skill triggers with representative query
6. Verify progressive disclosure (only loads needed files)
7. Mark `completed` **only after verification**

**Completion Criteria**: Skill registered, validation passes, triggers correctly, progressive disclosure verified

---

## Resources

**This Skill**:

- Steps: `steps/` (01-06 tactical guides)
- Template: `templates/skill-template.md` (SKILL.md structure)
- Reference: `reference/best-practices.md` (unified methodology)
- Reference: `reference/progressive-disclosure.md` (when to split files)
- Script: `scripts/validate_skill.py` (structure validation)

**Related Skills** (once created):

- `branching` - Git workflow with clear steps
- `testing` - Example of progressive disclosure with reference organization
- `branding` - Example of comprehensive reference documentation

## Key Principles

1. **Progressive Disclosure**: Metadata (~100 words) → SKILL.md (<500 lines) → Resources (as-needed)
2. **Description = Primary Trigger**: Include ALL trigger conditions in YAML frontmatter description
3. **Mandatory Loading**: Use "**MANDATORY**:" and "**BEFORE YOU PROCEED**:" directives
4. **Read Complete Files**: NEVER use offset/limit when reading templates/references/steps
5. **Context Efficiency**: "Claude is already very smart"—challenge every token
6. **Scripts for Determinism**: Executable code for tasks that would otherwise be rewritten repeatedly
7. **Bundled Resources**: scripts/ (executable), references/ (load as-needed), assets/ (output files)
8. **Verification Before Completion**: Explicit completion criteria, verify before marking done
9. **Keep SKILL.md Lean**: Under 500 lines—move details to references/
10. **Real Examples Over Explanations**: Show concrete patterns from proven skills
