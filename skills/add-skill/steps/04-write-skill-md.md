# Step 4: Write SKILL.md

## Purpose & Context (WHY)

**Problem**: SKILL.md is the most critical file—poor descriptions prevent triggering, bloated content wastes context, missing MANDATORY directives mean files never get loaded.

**Solution**: Write concise, well-structured SKILL.md following proven patterns with comprehensive description (PRIMARY TRIGGER) and proper directives.

**Why this matters**: Description in YAML frontmatter determines when skill loads. If description doesn't mention trigger conditions, skill never activates. If SKILL.md exceeds 500 lines, context bloat reduces effectiveness.

## Prerequisites

Step 3 complete—directory structure exists, SKILL.md initialized with frontmatter.

## **BEFORE YOU PROCEED**

Read these files to understand structure and patterns:

**MANDATORY**: Load `../templates/skill-template.md` NOW to see:

- Proven SKILL.md structure
- Section organization
- MANDATORY directive patterns

**MANDATORY**: Load `../reference/best-practices.md` NOW to understand:

- Description as primary trigger
- Context efficiency principles
- Progressive disclosure patterns

## TODO Summary

Create these tactical TODOs:

```
add-skill-4.1: Write comprehensive YAML description
add-skill-4.2: Write Purpose & Context section
add-skill-4.3: Write Prerequisites and TODO Summary
add-skill-4.4: Write Workflow Steps with MANDATORY directives
add-skill-4.5: Write Resources and Key Principles
add-skill-4.6: Verify length and completeness
```

## Tactical Steps (HOW)

### 4.1: Write Comprehensive YAML Description

**TODO**: `add-skill-4.1: Write comprehensive YAML description`

**Actions**:

1. Mark TODO `in_progress`
2. Update YAML frontmatter description with:
    - **What the skill does** (core functionality)
    - **When to use it** (specific trigger conditions)
    - **Use cases** (concrete scenarios)
    - ALL trigger keywords and phrases from Step 1
3. Description must be comprehensive (>50 words minimum)
4. Include alternative phrasings users might say
5. Mark `completed` after description written

**Completion Criteria**: Description includes WHAT, WHEN, and ALL trigger conditions

**Why this is critical**: Description is PRIMARY TRIGGER. If trigger phrase isn't in description, skill never loads.

**Example (good)**:

```yaml
description: Search GitHub repositories for code, issues, and pull requests. Use when users need to find GitHub content (repos, code files, issues, PRs), extract information from repositories, or analyze GitHub data. Trigger phrases: "search GitHub", "find repository", "GitHub issues", "pull requests", "git repo".
```

**Example (bad)**:

```yaml
description: GitHub integration skill
```

This won't trigger for "find repository" or "search issues"—too vague.

---

### 4.2: Write Purpose & Context Section

**TODO**: `add-skill-4.2: Write Purpose & Context section`

**Actions**:

1. Mark TODO `in_progress`
2. Write "Purpose & Context (WHY)" section with 2-3 paragraphs:
    - **Problem**: What pain point does this solve?
    - **Solution**: How does this skill address it?
    - **Context**: When to use vs when to skip
3. Keep concise—challenge every sentence
4. If section approaches >200 words, move details to references/
5. Add CRITICAL FILE READING RULE if skill has templates/references:
    ```markdown
    **CRITICAL FILE READING RULE**: When skill instructions reference template files, reference files, or any skill documentation, you MUST read the ENTIRE file (not partial reads). Never use offset/limit parameters when reading templates, references, or skill step files.
    ```
6. Mark `completed` after section written

**Completion Criteria**: Purpose & Context section clearly explains WHY this skill exists

---

### 4.3: Write Prerequisites and TODO Summary

**TODO**: `add-skill-4.3: Write Prerequisites and TODO Summary`

**Actions**:

1. Mark TODO `in_progress`
2. Write Prerequisites section:
    - List skills to study as examples (if relevant)
    - List reference files to read before starting (if critical)
3. Write TODO Summary:
    - Create strategic TODOs matching workflow steps (typically 3-6 steps)
    - Format: `[skill-name]-[N]: [5-8 word description]`
    - Display in code block for clarity
4. Mark `completed` after both sections written

**Completion Criteria**: Prerequisites complete, TODO Summary has strategic TODOs for all steps

**Example TODO Summary**:

```markdown
## TODO Summary

Create these 6 strategic TODOs:

\`\`\`
search-github-1: Understand search requirements and scope
search-github-2: Plan GitHub API tool usage
search-github-3: Implement search workflow
search-github-4: Add result formatting and filtering
search-github-5: Test with representative queries
search-github-6: Document findings format
\`\`\`
```

---

### 4.4: Write Workflow Steps with MANDATORY Directives

**TODO**: `add-skill-4.4: Write Workflow Steps with MANDATORY directives`

**Actions**:

1. Mark TODO `in_progress`
2. For each step (matching TODO Summary):
    - Section heading: `### Step [N]: [Name]`
    - TODO line: `**TODO**: \`[skill-name]-[N]: [description]\``
    - File reference: `**File**: \`steps/[NN]-[name].md\``
    - Actions list with **MANDATORY** directive:

        ```markdown
        **Actions**:

        1. Mark TODO \`in_progress\`
        2. **MANDATORY**: Load \`steps/[NN]-[name].md\` for tactical workflow
        3. Execute step procedures
        4. Verify completion criteria
        5. Mark \`completed\` **only after verification**
        ```

    - Completion criteria: Specific conditions that must be true
    - Horizontal rule between steps: `---`

3. Use MANDATORY directive pattern consistently
4. Keep each step overview to ~10 lines (details in step file)
5. Mark `completed` after all steps written

**Completion Criteria**: All workflow steps have MANDATORY directives and completion criteria

**MANDATORY directive pattern**:

```markdown
2. **MANDATORY**: Load \`steps/04-write-skill-md.md\` for tactical workflow
```

**Why MANDATORY works**: Proven pattern—forces file loading instead of hoping LLM reads it.

---

### 4.5: Write Resources and Key Principles

**TODO**: `add-skill-4.5: Write Resources and Key Principles`

**Actions**:

1. Mark TODO `in_progress`
2. Write Resources section:
    - **This Skill**: List steps/, scripts/, references/, templates/, assets/
    - **Related Skills**: Cross-references (if relevant)
    - **Other Resources**: External docs (if relevant)
3. Write Key Principles section:
    - Concise bullets (5-10 items)
    - Capture essence of methodology
    - Real patterns from proven skills
    - No redundancy with body content
4. Keep both sections concise (total <100 lines)
5. Mark `completed` after both sections written

**Completion Criteria**: Resources section complete, Key Principles capture skill essence

**Example Key Principles**:

```markdown
## Key Principles

1. **Context-first**: Understand requirements before implementing
2. **Precise queries**: Use appropriate search syntax for targeted results
3. **Result filtering**: Apply filters to reduce noise
4. **Source attribution**: Every finding includes source reference
5. **Rate limit awareness**: Use pagination, respect API limits
```

---

### 4.6: Verify Length and Completeness

**TODO**: `add-skill-4.6: Verify length and completeness`

**Actions**:

1. Mark TODO `in_progress`
2. Count lines in SKILL.md:
    ```bash
    wc -l skills/[name]/SKILL.md
    ```
3. Verify line count < 500 (target: 300-400)
4. If >500 lines:
    - Move detailed examples to references/
    - Move pattern catalogs to references/
    - Keep only essential workflow in SKILL.md
5. Verify all sections present:
    - YAML frontmatter (comprehensive description)
    - Purpose & Context
    - Prerequisites
    - TODO Summary
    - Workflow Steps (with MANDATORY directives)
    - Resources
    - Key Principles
6. Verify MANDATORY directives in every workflow step
7. Mark `completed` after verification

**Completion Criteria**: SKILL.md under 500 lines, all sections complete, MANDATORY directives present

**If line count >500**: Load `../reference/progressive-disclosure.md` for guidance on splitting content.

---

## Output

At completion, you should have:

1. **Complete SKILL.md** with all sections
2. **Comprehensive YAML description** (PRIMARY TRIGGER)
3. **MANDATORY directives** in all workflow steps
4. **Line count <500** (preferably 300-400)
5. **Clear completion criteria** for each step

**Next Step**: Load `steps/05-add-resources.md` to implement bundled resources
