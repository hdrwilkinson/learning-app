# Progressive Disclosure: When and How to Split

When SKILL.md approaches 500 lines, split content into references/ while maintaining clear loading triggers.

## Core Pattern

**3-level loading**:

1. Metadata: ~100 words, always loaded
2. SKILL.md: <500 lines, loaded on trigger
3. Resources: Loaded as-needed

**Target**: SKILL.md 300-400 lines

## When to Split

**Signals**:

- Line count >400 (approaching limit)
- Repetitive examples (could be cataloged)
- Domain-specific details (relevant to some use cases only)
- Advanced features (not always needed)
- Troubleshooting guides

## What Stays in SKILL.md

**Always**:

- YAML frontmatter (comprehensive description)
- Purpose & Context (2-3 paragraphs)
- Prerequisites and TODO Summary
- Workflow Steps (brief with MANDATORY directives)
- Resources and Key Principles

**Keep if short**:

- Quick start example (<20 lines)
- Essential patterns (<30 lines)

## What Moves to references/

- Detailed examples (>20 lines)
- Pattern catalogs
- API documentation
- Comprehensive guides (>100 lines)
- Alternative approaches
- Troubleshooting
- Domain-specific details

## Three Splitting Patterns

### Pattern 1: High-Level + Details

**Use when**: Single topic with optional details.

**Structure**:

```
skill/
├── SKILL.md          # Quick start + essentials
└── reference/
    ├── advanced.md   # Complex features
    └── examples.md   # Detailed examples
```

**SKILL.md links**:

```markdown
## Advanced Features

- **Complex feature**: See [advanced.md](reference/advanced.md)
- **More examples**: See [examples.md](reference/examples.md)
```

**Example**: pdf skill - SKILL.md has quick start, forms.md for complex filling, reference.md for advanced libs.

### Pattern 2: Domain Organization

**Use when**: Skill supports multiple domains/frameworks, users need only one.

**Structure**:

```
skill/
├── SKILL.md            # Overview + selection guide
└── reference/
    ├── domain-a.md     # Domain A specific
    └── domain-b.md     # Domain B specific
```

**SKILL.md links**:

```markdown
## Domain Selection

**For Domain A**: See [domain-a.md](reference/domain-a.md)
**For Domain B**: See [domain-b.md](reference/domain-b.md)
```

**Example**: mcp-builder - SKILL.md has workflow, node_mcp_server.md for TypeScript, python_mcp_server.md for Python.

### Pattern 3: Basic + Advanced Tiers

**Use when**: 80% of users need only basics.

**Structure**:

```
skill/
├── SKILL.md                # Essentials (80% use cases)
└── reference/
    ├── advanced.md         # Complex scenarios
    └── troubleshooting.md  # Error handling
```

**Example**: Most well-designed skills follow this pattern - testing, branding, issue-management (once created).

## Reference File Best Practices

**Table of contents for files >100 lines**:

```markdown
# Advanced Features

## Table of Contents

- [Feature 1](#feature-1)
- [Feature 2](#feature-2)

## Feature 1

[Content]
```

**Keep references one level deep**: All reference files link directly from SKILL.md. No nested subdirectories.

**Clear loading triggers**: Every reference needs explicit trigger:

```markdown
**For form filling**: See [forms.md](forms.md) for complete guide
```

Or with MANDATORY:

```markdown
**MANDATORY**: Load `reference/forms.md` NOW
```

## Real Examples

**add-skill**: SKILL.md ~200 lines + 6 step files + 2 references = comprehensive without bloat

**branding** (once created): SKILL.md with overview + references for detailed tokens and typography

**testing** (once created): SKILL.md with workflow + references for jest-patterns, playwright-patterns

## Migration When SKILL.md Grows

1. **Identify content to move**: Examples >20 lines, pattern catalogs, API docs, troubleshooting
2. **Choose pattern**: Based on content type (details, domains, or tiers)
3. **Create reference files**: Move content
4. **Update SKILL.md**: Replace with loading triggers
5. **Verify**: `wc -l SKILL.md` should be <500
6. **Test**: Verify references load only when triggered

## Summary

- Split when >400 lines
- Three patterns: details, domains, or tiers
- Keep references one level deep
- Clear loading triggers
- MANDATORY directives ensure loading
- Target: SKILL.md 300-400 lines
