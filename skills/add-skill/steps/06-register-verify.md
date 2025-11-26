# Step 6: Register and Verify

## Purpose & Context (WHY)

**Problem**: Skills not registered in skills-registry.mdc are invisible—LLMs never know they exist. Untested skills may not trigger on expected queries or fail to load required files.

**Solution**: Systematic registration and verification process ensuring skill discoverable and functional.

**Why this matters**: Registration is how LLMs discover skills exist (Level 1 metadata). Verification catches issues before skill goes into production use.

## Prerequisites

Step 5 complete—all resources implemented and referenced from SKILL.md.

## TODO Summary

Create these tactical TODOs:

```
add-skill-6.1: Add skill entry to skills-registry.mdc
add-skill-6.2: Run validation script
add-skill-6.3: Test skill triggering with representative query
add-skill-6.4: Verify progressive disclosure works
add-skill-6.5: Document any limitations or known issues
```

## Tactical Steps (HOW)

### 6.1: Add Skill Entry to Skills Registry

**TODO**: `add-skill-6.1: Add skill entry to skills-registry.mdc`

**Actions**:

1. Mark TODO `in_progress`
2. Open `.cursor/rules/skills-registry.mdc`
3. Add new entry following existing format:

    ```markdown
    ### [skill-name]

    **Trigger**: [When to use this skill]

    **Conditions**:

    - [Specific trigger condition 1]
    - [Specific trigger condition 2]
    - [Specific trigger condition 3]

    **Path**: `skills/[skill-name]/SKILL.md`

    **What it does**: [Brief description of workflow and key functionality]

    **Key principle**: [One sentence capturing essence]
    ```

4. Use trigger phrases from Step 1
5. Ensure conditions match YAML description
6. Add in alphabetical order (keep registry organized)
7. Mark `completed` after entry added

**Completion Criteria**: Skill entry added to registry with complete information

**Example registry entry for add-skill**:

```markdown
### add-skill

**Trigger**: When creating a new skill to extend project capabilities

**Conditions**:

- User says "create a skill for [X]" or "add [X] skill"
- Planning new integration or workflow
- Need systematic skill creation approach

**Path**: `skills/add-skill/SKILL.md`

**What it does**: 6-step workflow synthesizing Anthropic's progressive disclosure with proven patterns. Ensures skills trigger correctly, load efficiently, and follow unified best practices.

**Key principle**: Progressive disclosure + mandatory loading = efficient, reliable skills
```

---

### 6.2: Run Validation Script

**TODO**: `add-skill-6.2: Run validation script`

**Actions**:

1. Mark TODO `in_progress`
2. If skill has validation script, run it:
    ```bash
    python skills/add-skill/scripts/validate_skill.py skills/[skill-name]
    ```
3. If validation fails:
    - Read error messages carefully
    - Fix identified issues
    - Re-run validation
4. If skill has no validation script, manually verify:
    - YAML frontmatter valid
    - All referenced files exist
    - No forbidden files (README.md, CHANGELOG.md)
    - Directory name matches skill name
5. Mark `completed` after validation passes

**Completion Criteria**: Validation passes (automated or manual check)

**Common validation failures**:

- YAML frontmatter syntax errors
- Description too short (<50 words)
- SKILL.md references non-existent files
- Directory name doesn't match skill name
- Forbidden files present

---

### 6.3: Test Skill Triggering

**TODO**: `add-skill-6.3: Test skill triggering with representative query`

**Actions**:

1. Mark TODO `in_progress`
2. Formulate test query using trigger phrases from Step 1
3. In new conversation, say test query
4. Observe if skill loads:
    - Check if SKILL.md content appears in reasoning
    - Verify skill workflow starts
    - Confirm TODOs created
5. If skill doesn't trigger:
    - Review YAML description—does it include trigger phrase?
    - Check skills-registry.mdc entry
    - Verify file path correct
    - Test with alternative phrasing
6. Mark `completed` after successful trigger

**Completion Criteria**: Skill triggers correctly on representative query

**Example test queries for add-skill**:

- "I want to create a skill for searching GitHub repositories"
- "Help me add a new skill for PDF processing"
- "Create a skill that searches Slack messages"

**Debugging trigger failures**:

1. Check YAML description includes trigger keywords
2. Verify skills-registry.mdc entry present
3. Confirm file path correct in registry
4. Try more explicit trigger: "Use the [skill-name] skill to..."

---

### 6.4: Verify Progressive Disclosure

**TODO**: `add-skill-6.4: Verify progressive disclosure works`

**Actions**:

1. Mark TODO `in_progress`
2. Test that skill follows progressive disclosure:
    - Step 1: Only SKILL.md loaded (not all step files at once)
    - Step 1 execution: Only step 1 file loaded
    - Step 2 execution: Only step 2 file loaded (step 1 details forgotten)
    - References: Only loaded when MANDATORY directive encountered
3. Verify context efficiency:
    - LLM loads files when directed, not speculatively
    - Files read completely (no partial reads with offset/limit)
    - Previous step details not carried forward unnecessarily
4. If issues found:
    - Add missing MANDATORY directives
    - Strengthen loading instructions
    - Add "BEFORE YOU PROCEED" blockers
5. Mark `completed` after progressive disclosure verified

**Completion Criteria**: Skill loads files progressively, not all at once

**What good progressive disclosure looks like**:

- Step N starts: Only SKILL.md + step N file loaded
- Step N complete: Details from step N not needed for step N+1
- References: Loaded only when explicitly directed

**What bad progressive disclosure looks like**:

- All step files loaded at start
- All references loaded speculatively
- Previous step details carried through entire workflow

---

### 6.5: Document Limitations

**TODO**: `add-skill-6.5: Document any limitations or known issues`

**Actions**:

1. Mark TODO `in_progress`
2. Identify any limitations discovered during testing:
    - Specific use cases not supported
    - Known edge cases
    - Dependencies on other skills/tools
    - Performance considerations
3. Document in appropriate location:
    - Major limitations: Add to SKILL.md Purpose & Context
    - Minor limitations: Add to relevant step file or reference
    - Technical limitations: Add to reference documentation
4. If no significant limitations, skip documentation
5. Mark `completed` after limitations documented (or confirmed none)

**Completion Criteria**: Any discovered limitations appropriately documented

**Example limitations** (when present):

- "Requires specific tools configured and authenticated"
- "Only supports public repositories (no private access)"
- "Rate limits apply: max 100 API calls per execution"
- "Depends on another skill for specific data"

**Most skills should have minimal or no limitations** if designed well. Document only genuine constraints.

---

## Output

At completion, you should have:

1. **Registry entry added** to `.cursor/rules/skills-registry.mdc`
2. **Validation passing** (automated or manual)
3. **Skill triggering correctly** on representative queries
4. **Progressive disclosure verified** working as intended
5. **Limitations documented** (if any significant ones exist)

**Skill is now complete and ready for use!**

## Next Steps After Completion

**Usage**:

- Use skill on real tasks
- Observe how it performs
- Note any struggles or inefficiencies

**Iteration**:

- Update SKILL.md based on real usage
- Add examples from actual workflows
- Refine step files for clarity
- Update references with discovered patterns

**Maintenance**:

- Keep skills lean (don't let them bloat over time)
- Update when underlying tools/APIs change
- Remove steps/resources that prove unnecessary
- Add new resources as patterns emerge

**Philosophy**: Start lean, iterate based on usage. This skill is a starting point, not a final product. Real usage reveals what truly matters.
