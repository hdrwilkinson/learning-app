# Best Practices for Skills

Unified patterns from Anthropic's research and validated approaches.

## Core Principles

**Context window is a public good.** Default assumption: Claude is already smart. Challenge every token.

**Read complete files, never partial.** When instructions reference templates/references/steps, read entire file (no offset/limit).

**Progressive disclosure: 3 levels**

1. Metadata (~100 words, always loaded) - YAML frontmatter
2. SKILL.md (<500 lines, loaded on trigger) - Strategic overview
3. Resources (as-needed) - steps/, references/, scripts/, templates/, assets/

## Triggering: Description is PRIMARY

YAML `description` determines when skill loads. Must include:

- What skill does
- When to use it
- Trigger phrases
- Use cases

Minimum 50 words, aim for 100+.

**Good**: "Search GitHub repos for code, issues, PRs. Use when finding content, extracting info, analyzing data. Triggers: 'search github', 'find repository', 'github issues'."

**Bad**: "GitHub skill" (missing triggers, use cases)

## Mandatory Loading Directives

Without strong directives, LLMs skip files. Use two-level pattern:

**In SKILL.md**:

```markdown
2. **MANDATORY**: Load `steps/04-name.md` for tactical workflow
```

**In step files**:

```markdown
**BEFORE YOU PROCEED**: Read `../reference/file.md`

**Actions**:

1. **MANDATORY**: Load `../reference/file.md` NOW (don't skip)
```

Proven pattern—files actually get loaded.

## Bundled Resources

**scripts/** (executable code)

- When: Deterministic operations, fragile processes, repeated code
- Examples: Validation, form filling, API clients
- May execute without loading into context

**references/** (docs loaded as-needed)

- When: Detailed guides, API docs, patterns
- Examples: Search syntax, tool catalogs, examples
- Keeps SKILL.md lean

**assets/** (files used in output)

- When: Templates, images, boilerplate for results
- Examples: Logos, HTML templates, fonts
- NOT for documentation

**Many skills have zero scripts and zero assets.** Only create when needed.

## Degrees of Freedom

**High (text instructions)**: Multiple valid approaches, context-dependent

- Example: "Search with appropriate filters"

**Medium (patterns)**: Preferred pattern exists, some variation OK

- Example: "Use search → execute → verify pattern"

**Low (scripts)**: Fragile, consistency critical, specific sequence

- Example: PDF form filling, validation scripts

**Rule**: Low freedom → script. High/medium → document in SKILL.md/references.

## Verification Before Completion

Every TODO needs explicit completion criteria:

```markdown
**Actions**:

1. Mark TODO `in_progress`
2. Execute work
3. Verify: [specific condition]
4. Mark `completed` **only after verification**

**Completion Criteria**: [Specific conditions that must be true]
```

Never mark done without verification.

## Keep SKILL.md Lean

**Target**: 300-400 lines
**Maximum**: 500 lines

**Keep in SKILL.md**:

- YAML frontmatter with comprehensive description
- Purpose & Context (2-3 paragraphs)
- Prerequisites and TODO Summary
- Workflow Steps (brief with MANDATORY directives)
- Resources and Key Principles

**Move to references/**:

- Detailed examples
- Pattern catalogs
- API documentation
- Troubleshooting
- Alternative approaches

## Anti-Patterns

**Forbidden files** (add clutter):

- README.md, INSTALLATION_GUIDE.md, CHANGELOG.md, CONTRIBUTING.md

**Common mistakes**:

- ❌ Vague description: "GitHub integration"
- ✅ Comprehensive: "Search GitHub repos... Triggers: 'search github', 'find repository'..."

- ❌ Weak directive: "See steps/01-name.md for details"
- ✅ MANDATORY: "**MANDATORY**: Load `steps/01-name.md` for tactical workflow"

- ❌ No criteria: "1. Do work 2. Mark completed"
- ✅ Verification: "3. Verify: File exists 4. Mark `completed` **only after verification**"

## Real Examples

**add-skill**: MANDATORY directives, verification, complete file reads
**testing** (once created): Progressive disclosure, step/reference organization
**pdf** (Anthropic): Quick start in SKILL.md, details in references/, scripts for deterministic ops
**skill-creator** (Anthropic): Step-based process, reference organization

## Quick Decision Checklist

Before considering skill complete:

1. ☐ Description includes ALL trigger phrases (>50 words)?
2. ☐ SKILL.md < 500 lines?
3. ☐ All steps have **MANDATORY** directives?
4. ☐ Every step has explicit completion criteria?
5. ☐ Scripts tested and working (if any)?
6. ☐ Resources referenced with clear loading triggers?
