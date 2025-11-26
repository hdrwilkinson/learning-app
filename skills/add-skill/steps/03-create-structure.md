# Step 3: Create Directory Structure

## Purpose & Context (WHY)

**Problem**: Creating directories manually often leads to inconsistent structures, missing subdirectories, or incorrect initialization.

**Solution**: Systematic directory creation following proven patterns with proper initialization.

**Why this matters**: Proper structure ensures skill discovery, correct file organization, and adherence to conventions that enable progressive disclosure.

## Prerequisites

Step 2 complete—you have resource plan (which subdirectories needed).

## TODO Summary

Create these tactical TODOs:

```
add-skill-3.1: Create main skill directory
add-skill-3.2: Create planned subdirectories
add-skill-3.3: Initialize SKILL.md with frontmatter
add-skill-3.4: Verify directory structure
```

## Tactical Steps (HOW)

### 3.1: Create Main Skill Directory

**TODO**: `add-skill-3.1: Create main skill directory`

**Actions**:

1. Mark TODO `in_progress`
2. Determine skill name (lowercase, hyphens for spaces)
    - Good: `search-github`, `pdf-editor`, `brand-guidelines`
    - Bad: `SearchGitHub`, `pdf_editor`, `Brand Guidelines`
3. Create directory: `skills/[name]/`
4. Verify directory exists
5. Mark `completed` after verification

**Completion Criteria**: Main skill directory exists at correct path with correct naming

**Naming rules**:

- Lowercase only
- Hyphens separate words
- Descriptive but concise
- No underscores, spaces, or special characters

---

### 3.2: Create Planned Subdirectories

**TODO**: `add-skill-3.2: Create planned subdirectories`

**Actions**:

1. Mark TODO `in_progress`
2. Based on Step 2 resource plan, create needed subdirectories:
    - If workflow has steps → create `steps/`
    - If plan includes scripts → create `scripts/`
    - If plan includes references → create `reference/`
    - If plan includes templates → create `templates/`
    - If plan includes assets → create `assets/`
3. Use single command for efficiency:
    ```bash
    mkdir -p skills/[name]/{steps,scripts,reference,templates}
    ```
4. Verify all needed subdirectories exist
5. Mark `completed` after verification

**Completion Criteria**: All planned subdirectories exist

**Common patterns**:

- Most skills: `steps/`, `reference/`
- Skills with validation: `scripts/`
- Skills with templates: `templates/`
- Skills with output files: `assets/`

**Not every skill needs all subdirectories**. Create only what Step 2 planned.

---

### 3.3: Initialize SKILL.md with Frontmatter

**TODO**: `add-skill-3.3: Initialize SKILL.md with frontmatter`

**Actions**:

1. Mark TODO `in_progress`
2. Create `skills/[name]/SKILL.md` with minimal frontmatter:

    ```yaml
    ---
    name: [skill-name]
    description: [Placeholder - will be written in Step 4]
    ---
    # [Skill Name]

    [Content will be written in Step 4]
    ```

3. Use actual skill name (must match directory name)
4. Leave description as placeholder for now (Step 4 writes comprehensive version)
5. Verify file exists with valid YAML
6. Mark `completed` after verification

**Completion Criteria**: SKILL.md exists with valid YAML frontmatter skeleton

**Why initialize now**: Allows Step 4 to focus on content rather than structure setup.

---

### 3.4: Verify Directory Structure

**TODO**: `add-skill-3.4: Verify directory structure`

**Actions**:

1. Mark TODO `in_progress`
2. List directory contents to verify:
    ```bash
    ls -la skills/[name]/
    ```
3. Check against Step 2 resource plan:
    - All planned subdirectories present?
    - SKILL.md initialized?
    - No extraneous directories created?
4. Verify directory name matches YAML frontmatter name
5. Mark `completed` after verification

**Completion Criteria**: Directory structure matches resource plan exactly

**Example structure after this step**:

```
skills/add-skill/
├── SKILL.md                    # Initialized with frontmatter
├── steps/                      # Empty, ready for step files
├── scripts/                    # Empty, ready for scripts
├── templates/                  # Empty, ready for templates
└── reference/                  # Empty, ready for references
```

---

## Output

At completion, you should have:

1. **Main skill directory** at `skills/[name]/`
2. **All planned subdirectories** created
3. **SKILL.md initialized** with valid YAML frontmatter skeleton
4. **Structure verified** against resource plan

**Next Step**: Load `steps/04-write-skill-md.md` to write comprehensive SKILL.md content
