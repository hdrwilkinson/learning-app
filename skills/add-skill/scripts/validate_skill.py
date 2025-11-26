#!/usr/bin/env python3
"""
Validate skill structure and frontmatter.

Usage: python scripts/validate_skill.py /path/to/skill

Checks:
- SKILL.md exists and has valid YAML frontmatter
- Required fields present (name, description)
- Description is comprehensive (>50 words)
- SKILL.md under 500 lines
- Directory name matches skill name in frontmatter
- All referenced files exist
- No forbidden files (README.md, CHANGELOG.md, etc.)
"""

import sys
import os
import re
import textwrap
from pathlib import Path


FORBIDDEN_FILES = [
    "README.md",
    "INSTALLATION_GUIDE.md",
    "QUICK_REFERENCE.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
]

FIELD_PATTERN_TEMPLATE = (
    r"^{field}:\s*(?P<value>.*(?:\n(?![A-Za-z0-9_-]+\s*:).*)*)"
)
LITERAL_BLOCKS = {"|", "|-"}
FOLDED_BLOCKS = {">", ">-"}
CODE_PATH_PATTERN = re.compile(
    r"`(?P<path>(?:\.\./)?(?:steps|reference|templates|scripts|assets)/[^`]+)`"
)
LINK_PATH_PATTERN = re.compile(
    r"\[[^\]]+\]\((?P<path>(?:\.\./)?(?:steps|reference|templates|scripts|assets)/[^)]+)\)"
)


def _extract_frontmatter_field(frontmatter: str, field: str):
    """Return field value supporting multi-line YAML content."""
    pattern = FIELD_PATTERN_TEMPLATE.format(field=re.escape(field))
    match = re.search(pattern, frontmatter, re.MULTILINE)
    if not match:
        return None

    raw_value = match.group("value") or ""
    raw_value = raw_value.rstrip()
    if not raw_value:
        return ""

    lines = raw_value.splitlines()
    first = lines[0].strip()

    if first in LITERAL_BLOCKS | FOLDED_BLOCKS:
        dedented = textwrap.dedent("\n".join(lines[1:])).strip("\n")
        if first in FOLDED_BLOCKS:
            return " ".join(line.strip() for line in dedented.splitlines()).strip()
        return dedented.strip()

    value = raw_value.strip()
    if value.startswith("[") and value.endswith("]"):
        return value[1:-1].strip()

    if len(lines) == 1:
        return value

    first_line = lines[0].strip()
    remainder = textwrap.dedent("\n".join(lines[1:])).strip()
    combined = " ".join(
        segment
        for segment in [first_line, remainder.replace("\n", " ")]
        if segment
    )
    return combined.strip()


def validate_skill(skill_path):
    """Validate skill structure and return list of errors."""
    errors = []
    skill_path = Path(skill_path)
    
    # Check SKILL.md exists
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        errors.append("SKILL.md not found")
        return errors
    
    # Read content
    try:
        content = skill_md.read_text()
    except Exception as e:
        errors.append(f"Failed to read SKILL.md: {e}")
        return errors
    
    # Check frontmatter exists
    if not content.startswith("---"):
        errors.append("SKILL.md missing YAML frontmatter (must start with '---')")
        return errors
    
    # Extract frontmatter
    try:
        _, frontmatter, body = content.split("---", 2)
    except ValueError:
        errors.append("SKILL.md has invalid frontmatter (missing closing '---')")
        return errors

    frontmatter = frontmatter.strip()
    
    # Parse frontmatter fields
    name_value = _extract_frontmatter_field(frontmatter, "name")
    desc_value = _extract_frontmatter_field(frontmatter, "description")
    
    # Check required fields
    if not name_value:
        errors.append("YAML frontmatter missing required field: name")
    else:
        skill_name = name_value.strip()
        
        # Validate name format
        if not re.match(r"^[a-z0-9-]+$", skill_name):
            errors.append(
                f"Skill name '{skill_name}' invalid (use lowercase, hyphens only)"
            )
        
        # Check name matches directory
        if skill_path.name != skill_name:
            errors.append(
                f"Directory name '{skill_path.name}' doesn't match "
                f"skill name '{skill_name}' in frontmatter"
            )
    
    if not desc_value:
        errors.append("YAML frontmatter missing required field: description")
    else:
        normalized_description = " ".join(desc_value.split())
        word_count = len(normalized_description.split())
        
        # Check description is comprehensive
        if word_count < 20:
            errors.append(
                f"Description too short ({word_count} words). "
                f"Should be comprehensive (>50 words recommended) and include "
                f"trigger conditions."
            )
    
    # Check line count
    lines = content.split("\n")
    if len(lines) > 500:
        errors.append(
            f"SKILL.md too long ({len(lines)} lines). "
            f"Should be under 500 lines. Move details to references/."
        )
    
    # Check for forbidden files
    for forbidden in FORBIDDEN_FILES:
        if (skill_path / forbidden).exists():
            errors.append(
                f"Forbidden file found: {forbidden}. "
                f"Skills should contain only essential files."
            )
    
    # Extract referenced files from body
    # Match patterns like: `steps/01-name.md`, `reference/file.md`, etc.
    referenced_files = set()
    for match in CODE_PATH_PATTERN.finditer(body):
        referenced_files.add(match.group("path").strip())
    for match in LINK_PATH_PATTERN.finditer(body):
        referenced_files.add(match.group("path").strip())
    
    # Check referenced files exist
    for ref_file in sorted(referenced_files):
        if ref_file.startswith("../"):
            errors.append(
                f"Referenced file points outside skill directory: {ref_file}"
            )
            continue
        file_path = skill_path / ref_file
        if not file_path.exists():
            errors.append(f"Referenced file not found: {ref_file}")
    
    return errors


def main():
    if len(sys.argv) != 2:
        print("Usage: python validate_skill.py /path/to/skill")
        print()
        print("Validates skill structure and frontmatter.")
        sys.exit(1)
    
    skill_path = sys.argv[1]
    
    if not os.path.exists(skill_path):
        print(f"❌ Error: Path not found: {skill_path}")
        sys.exit(1)
    
    if not os.path.isdir(skill_path):
        print(f"❌ Error: Not a directory: {skill_path}")
        sys.exit(1)
    
    print(f"Validating skill at: {skill_path}")
    print()
    
    errors = validate_skill(skill_path)
    
    if errors:
        print("❌ Validation failed:")
        print()
        for i, error in enumerate(errors, 1):
            print(f"{i}. {error}")
        print()
        print(f"Found {len(errors)} error(s)")
        sys.exit(1)
    else:
        print("✅ Skill validation passed")
        print()
        print("All checks passed:")
        print("  ✓ SKILL.md exists")
        print("  ✓ Valid YAML frontmatter")
        print("  ✓ Required fields present (name, description)")
        print("  ✓ Description comprehensive")
        print("  ✓ SKILL.md under 500 lines")
        print("  ✓ Directory name matches skill name")
        print("  ✓ Referenced files exist")
        print("  ✓ No forbidden files")
        sys.exit(0)


if __name__ == "__main__":
    main()

