# Step 5: Implement Bundled Resources

## Purpose & Context (WHY)

**Problem**: Resources planned but not implemented render skill incomplete. Scripts not tested introduce bugs. References without MANDATORY directives never get loaded.

**Solution**: Systematic implementation of all planned resources with testing and proper references from SKILL.md.

**Why this matters**: Bundled resources are what make skills reusable and token-efficient. Scripts prevent code rewriting, references keep SKILL.md lean, assets provide templates for output.

## Prerequisites

Step 4 complete—SKILL.md written with workflow steps.

Step 2 complete—resource plan lists scripts, references, assets to create.

## TODO Summary

Create these tactical TODOs:

```
add-skill-5.1: Implement and test scripts
add-skill-5.2: Write reference documentation files
add-skill-5.3: Add template files (if planned)
add-skill-5.4: Add asset files (if planned)
add-skill-5.5: Reference resources from SKILL.md with MANDATORY directives
add-skill-5.6: Delete unused example files
```

## Tactical Steps (HOW)

### 5.1: Implement and Test Scripts

**TODO**: `add-skill-5.1: Implement and test scripts`

**Actions**:

1. Mark TODO `in_progress`
2. For each script from Step 2 plan:
    - Write Python/Bash script in `scripts/` directory
    - Include proper error handling
    - Add helpful error messages
    - Include usage docstring/comments
3. **CRITICAL: Test each script by running it**:
    ```bash
    python scripts/[script-name].py [test-args]
    ```
4. Verify:
    - Script runs without errors
    - Output matches expected format
    - Error cases handled gracefully
5. If many similar scripts, test representative sample
6. Mark `completed` after all scripts implemented and tested

**Completion Criteria**: All planned scripts exist, tested, and working correctly

**Example script structure** (from validate_skill.py):

```python
#!/usr/bin/env python3
"""
Validate skill structure and frontmatter.

Usage: python scripts/validate_skill.py /path/to/skill
"""

import sys
import os
from pathlib import Path

def validate_skill(skill_path):
    """Validate skill structure."""
    errors = []

    # Check SKILL.md exists
    skill_md = Path(skill_path) / "SKILL.md"
    if not skill_md.exists():
        errors.append("SKILL.md not found")
        return errors

    # Validate frontmatter
    content = skill_md.read_text()
    if not content.startswith("---"):
        errors.append("SKILL.md missing YAML frontmatter")

    # More validation...

    return errors

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate_skill.py /path/to/skill")
        sys.exit(1)

    errors = validate_skill(sys.argv[1])
    if errors:
        print("❌ Validation failed:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("✅ Skill validation passed")
        sys.exit(0)
```

**When scripts aren't needed**: Many skills have zero scripts (debugging, branching). Only create when Step 2 identified low-freedom operations requiring determinism.

---

### 5.2: Write Reference Documentation Files

**TODO**: `add-skill-5.2: Write reference documentation files`

**Actions**:

1. Mark TODO `in_progress`
2. For each reference file from Step 2 plan:
    - Create markdown file in `reference/` directory
    - Write content per plan (API docs, patterns, examples)
    - Include table of contents if file >100 lines
    - Use clear section headings
    - Include real examples (not abstract explanations)
3. Verify file is complete and self-contained
4. Mark `completed` after all references written

**Completion Criteria**: All planned reference files exist with complete content

**Reference file organization patterns**:

**Pattern 1: Single comprehensive guide**

```markdown
# [Topic] Reference

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1

[Content with examples]

## Section 2

[Content with examples]
```

**Pattern 2: Domain-specific organization**

```
reference/
├── api-basics.md      # Core API patterns
├── search-syntax.md   # Search-specific docs
└── examples.md        # Real usage examples
```

**Pattern 3: Conditional details**

```
reference/
├── quick-start.md     # Essential information
├── advanced.md        # Complex features
└── troubleshooting.md # Error handling
```

Use pattern that matches skill complexity. Most skills: 1-3 reference files maximum.

---

### 5.3: Add Template Files

**TODO**: `add-skill-5.3: Add template files (if planned)`

**Actions**:

1. Mark TODO `in_progress`
2. If Step 2 planned templates:
    - Create markdown/text templates in `templates/` directory
    - Include inline comments explaining structure
    - Use placeholders: `[PLACEHOLDER]` or `{variable}`
    - Show example values in comments
3. If no templates planned, skip this step
4. Mark `completed` after templates created (or confirmed none needed)

**Completion Criteria**: All planned templates exist with clear structure and placeholders

**Example template** (from update-customer):

```markdown
---

# [Customer Name] Overview

**Status**: [Discovery/Build/Feedback/Stable]  
**Phase**: [Current phase]  
**Last Updated**: [Date]

## Current Project Status

[One paragraph: What's happening right now? What needs decisions?]

## What Needs to Happen

[Bullet list of actions needed to move forward]

<!-- More sections... -->
```

**When templates needed**:

- Output follows consistent structure (reports, documents, pages)
- Users need starting point for creation
- Format has required fields

**When templates NOT needed**:

- Free-form output
- No consistent structure
- Research/analysis skills (find information, no templated output)

---

### 5.4: Add Asset Files

**TODO**: `add-skill-5.4: Add asset files (if planned)`

**Actions**:

1. Mark TODO `in_progress`
2. If Step 2 planned assets:
    - Add files to `assets/` directory
    - Images (logos, icons) - verify formats work
    - Boilerplate code - verify syntax correct
    - Documents - verify they open correctly
3. If no assets planned, skip this step
4. Mark `completed` after assets added (or confirmed none needed)

**Completion Criteria**: All planned assets exist and verified working

**Remember**: Assets are OUTPUT files (used in results), not documentation. Most skills have zero assets.

**Skills with assets** (rare):

- `brand-guidelines` - Logo images, font files
- `frontend-design` - HTML/React boilerplate
- `theme-factory` - CSS theme files

**Skills without assets** (common):

- `add-skill` - No output templates
- `debugging` - Pure workflow
- `testing` - References patterns only
- `branching` - Git workflow, no templates

---

### 5.5: Reference Resources from SKILL.md

**TODO**: `add-skill-5.5: Reference resources from SKILL.md with MANDATORY directives`

**Actions**:

1. Mark TODO `in_progress`
2. Open SKILL.md and verify:
    - Scripts mentioned in relevant workflow steps with usage examples
    - References mentioned with **MANDATORY** loading directives
    - Templates mentioned with **MANDATORY** loading directives
    - Assets mentioned where they're used
3. Add MANDATORY directives if missing:

    ```markdown
    **BEFORE YOU PROCEED**: Read `reference/[file].md` to understand [topic]

    **Actions**:

    1. **MANDATORY**: Load `reference/[file].md` NOW
    ```

4. Verify every resource has clear loading trigger in SKILL.md or step file
5. Mark `completed` after all resources properly referenced

**Completion Criteria**: Every resource referenced from SKILL.md with clear loading conditions

**Why this matters**: Resources without MANDATORY directives often never get loaded. LLMs skip "see [file] for details" without strong directives.

**Proven pattern from update-customer**:

```markdown
**BEFORE YOU PROCEED**: Read `../reference/best-practices.md` to understand:

- Progressive disclosure patterns
- Mandatory loading directives

**Actions**:

1. **MANDATORY**: Load `../reference/best-practices.md` NOW (don't skip this)
2. Use patterns from that file to write SKILL.md
```

---

### 5.6: Delete Unused Example Files

**TODO**: `add-skill-5.6: Delete unused example files`

**Actions**:

1. Mark TODO `in_progress`
2. Check for any placeholder/example files:
    - Example scripts not implemented
    - Template placeholders not used
    - Empty directories
3. Delete anything not part of final skill
4. Verify final file structure matches resource plan
5. Mark `completed` after cleanup

**Completion Criteria**: Only implemented resources remain, no unused placeholders

**Common cleanup**:

- Remove `scripts/example.py` if not needed
- Remove empty `assets/` directory if no assets
- Remove template files that weren't used

---

## Output

At completion, you should have:

1. **All scripts implemented and tested** (if any)
2. **All reference files written** with complete content
3. **All templates created** with clear structure (if any)
4. **All assets added** and verified (if any)
5. **All resources referenced from SKILL.md** with MANDATORY directives
6. **No unused files remaining**

**Next Step**: Load `steps/06-register-verify.md` to register skill and verify triggering
