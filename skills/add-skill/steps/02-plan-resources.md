# Step 2: Plan Reusable Resources

## Purpose & Context (WHY)

**Problem**: Without planning, skills end up with duplicated code, bloated SKILL.md files, or missing critical scripts that force LLMs to rewrite code repeatedly.

**Solution**: Analyze examples systematically to identify which resources belong in scripts/ (deterministic operations), references/ (documentation loaded as-needed), or assets/ (output templates).

**Why this matters**: Proper resource planning keeps SKILL.md lean (<500 lines), makes skills token-efficient, and ensures deterministic operations use scripts instead of hoping LLMs write correct code every time.

## Prerequisites

Step 1 complete—you have 3-5 concrete scenarios documented.

## TODO Summary

Create these tactical TODOs:

```
add-skill-2.1: Analyze scenarios for reusable components
add-skill-2.2: Apply degrees of freedom framework
add-skill-2.3: List planned scripts with purposes
add-skill-2.4: List planned references with content
add-skill-2.5: List planned assets (if any)
```

## **BEFORE YOU PROCEED**

Read `../reference/best-practices.md` sections on:

- Bundled resources (scripts/references/assets)
- Degrees of freedom (when to use scripts vs text)

## Tactical Steps (HOW)

### 2.1: Analyze Scenarios for Reusable Components

**TODO**: `add-skill-2.1: Analyze scenarios for reusable components`

**Actions**:

1. Mark TODO `in_progress`
2. **MANDATORY**: Load `../reference/best-practices.md` NOW for bundled resources guidance
3. For each scenario from Step 1, ask:
    - "Would I need to write code to do this?"
    - "Would that code be the same every time?"
    - "Is this operation fragile or error-prone?"
    - "Do I need documentation to reference while working?"
    - "Do I need template files for output?"
4. Group findings into categories:
    - **Repetitive code**: Same code written multiple times → scripts/
    - **Reference docs**: Information to consult → references/
    - **Output templates**: Files used in results → assets/
5. Mark `completed` after analysis

**Completion Criteria**: Clear understanding of what's reusable vs one-time operations

**Example for GitHub skill**:

- Repetitive: None (use GitHub API tools directly)
- Reference docs: GitHub API search syntax, rate limit handling
- Assets: None needed

---

### 2.2: Apply Degrees of Freedom Framework

**TODO**: `add-skill-2.2: Apply degrees of freedom framework`

**Actions**:

1. Mark TODO `in_progress`
2. For each reusable component, determine freedom level:

    **High freedom (text instructions)**:
    - Multiple valid approaches exist
    - Context-dependent decisions required
    - Heuristics guide approach
    - Example: "Search GitHub with appropriate filters"

    **Medium freedom (pseudocode/patterns)**:
    - Preferred pattern exists
    - Some variation acceptable
    - Configuration affects behavior
    - Example: "Use search → execute → verify pattern"

    **Low freedom (specific scripts)**:
    - Operations fragile and error-prone
    - Consistency critical
    - Specific sequence must be followed
    - Example: PDF form filling, file validation

3. Decision rule: If low freedom → create script. If high/medium → document in SKILL.md or references/
4. Mark `completed` after framework applied

**Completion Criteria**: Each reusable component classified by freedom level with clear rationale

---

### 2.3: List Planned Scripts

**TODO**: `add-skill-2.3: List planned scripts with purposes`

**Actions**:

1. Mark TODO `in_progress`
2. For each low-freedom operation, document:
    - Script name (e.g., `validate_structure.py`)
    - Purpose (what it does)
    - Inputs (parameters)
    - Outputs (what it returns)
    - Why it needs to be a script (fragility, consistency, reuse)
3. Mark `completed` after scripts planned

**Completion Criteria**: List of scripts with clear purposes and interfaces

**Example for add-skill**:

```markdown
**scripts/validate_skill.py**:

- Purpose: Validate skill structure and frontmatter
- Inputs: Path to skill directory
- Outputs: Pass/fail with specific error messages
- Why: Frontmatter parsing, file structure checking, description validation are error-prone and benefit from deterministic checking
```

**When to create scripts** (from Anthropic patterns):

- Same code repeatedly rewritten (PDF rotation, form filling)
- Deterministic reliability required (validation, parsing)
- Complex calculations or transformations

---

### 2.4: List Planned References

**TODO**: `add-skill-2.4: List planned references with content`

**Actions**:

1. Mark TODO `in_progress`
2. For medium/high freedom operations needing documentation, plan references/:
    - File name (e.g., `api-reference.md`)
    - Content summary (what information it contains)
    - When to load (what triggers reading this file)
    - Why not in SKILL.md (keeps SKILL.md lean, loaded conditionally)
3. Organize by domain if multiple frameworks/variants:
    - Pattern: `references/aws.md`, `references/gcp.md` (load based on user choice)
    - Pattern: `references/finance.md`, `references/sales.md` (load based on query domain)
4. Mark `completed` after references planned

**Completion Criteria**: List of reference files with content summaries and loading triggers

**Example for add-skill**:

```markdown
**reference/best-practices.md**:

- Content: Synthesized Anthropic patterns and proven approaches, real examples
- When to load: Step 2 (resource planning), Step 4 (writing SKILL.md)
- Why not in SKILL.md: Detailed patterns would bloat main file

**reference/progressive-disclosure.md**:

- Content: When to split files, patterns for organizing references
- When to load: Step 4 when SKILL.md approaches 500 lines or needs splitting guidance
- Why not in SKILL.md: Conditional detail, not always needed
```

---

### 2.5: List Planned Assets

**TODO**: `add-skill-2.5: List planned assets (if any)`

**Actions**:

1. Mark TODO `in_progress`
2. Identify output files that will be used (not loaded into context):
    - Templates (HTML, React boilerplate, document templates)
    - Images (logos, brand assets)
    - Fonts (typography files)
    - Sample files (example documents to copy/modify)
3. For each asset:
    - File name and type
    - Purpose (what output uses it)
    - Why it's an asset not reference (used in output, not for reading)
4. Mark `completed` after assets planned

**Completion Criteria**: List of asset files (if any) with purposes

**Note**: Many skills have zero assets. Assets are for **output files**, not documentation.

**Example skills with assets**:

- `brand-guidelines`: Logo images, font files for artifacts
- `frontend-design`: HTML/React boilerplate templates
- `theme-factory`: CSS theme templates

**Example skills with NO assets**:

- `add-skill`: No output templates needed
- `debugging`: Pure workflow skill
- `testing`: References patterns, no output templates

---

## Output

At completion, you should have:

1. **Resource classification** (what's reusable vs one-time)
2. **Degrees of freedom analysis** (high/medium/low for each component)
3. **Scripts list** (name, purpose, interface for each script)
4. **References list** (file name, content summary, loading triggers)
5. **Assets list** (if any—many skills have none)

**This plan informs**:

- Step 3: Which subdirectories to create
- Step 4: What to reference from SKILL.md
- Step 5: What resources to implement

**Next Step**: Load `steps/03-create-structure.md` to create directories and initialize files
