# Step 1: Understand with Concrete Examples

## Purpose & Context (WHY)

**Problem**: Skills created without concrete examples often miss critical use cases or have vague descriptions that don't trigger properly.

**Solution**: Start with specific, realistic examples of how the skill will be used. These examples inform everything downstream—trigger phrases, resource planning, and verification criteria.

**Why this matters**: Anthropic's research shows skills perform best when designed around concrete use cases, not abstract capabilities. Examples reveal what's truly needed vs. what seems useful in theory.

## Prerequisites

User must provide or approve examples of how the skill will be used.

## TODO Summary

Create these tactical TODOs:

```
add-skill-1.1: Ask user for concrete examples and trigger phrases
add-skill-1.2: Generate validation examples if needed
add-skill-1.3: Document 3-5 representative scenarios
add-skill-1.4: Identify common patterns across examples
```

## Tactical Steps (HOW)

### 1.1: Ask User for Concrete Examples

**TODO**: `add-skill-1.1: Ask user for concrete examples and trigger phrases`

**Actions**:

1. Mark TODO `in_progress`
2. Ask focused questions (avoid overwhelming with 10+ questions):
    - "What functionality should this skill support?"
    - "Can you give examples of how it would be used?"
    - "What would a user say that should trigger this skill?"
3. Document user responses
4. Mark `completed` after gathering examples

**Completion Criteria**: User has provided specific examples or use cases

**Example questions for a GitHub skill**:

- "Should it search repositories? Extract information? Create issues?"
- "Example: 'Find all PRs merged last week' or 'What issues mention authentication'?"
- "What would trigger this skill vs using GitHub directly?"

---

### 1.2: Generate Validation Examples

**TODO**: `add-skill-1.2: Generate validation examples if needed`

**Actions**:

1. Mark TODO `in_progress`
2. If user examples are vague, generate specific scenarios:
    - "I imagine users asking: [specific quote]"
    - "Is [scenario] something you'd want supported?"
3. Get user confirmation on generated examples
4. Mark `completed` after examples validated

**Completion Criteria**: Examples are specific enough to design against

**Anti-pattern**: "The skill helps with GitHub" ❌
**Good pattern**: "User says 'Find all issues assigned to me that mention API changes'" ✅

---

### 1.3: Document Representative Scenarios

**TODO**: `add-skill-1.3: Document 3-5 representative scenarios`

**Actions**:

1. Mark TODO `in_progress`
2. Create a list of 3-5 concrete scenarios covering:
    - Most common use case (80% of usage)
    - Edge cases that reveal complexity
    - Cross-cutting concerns (pagination, error handling, filtering)
3. For each scenario, document:
    - User query (exact words)
    - Expected outcome
    - Required data/tools
4. Mark `completed` after scenarios documented

**Completion Criteria**: Have 3-5 specific scenarios with user queries and expected outcomes

**Example for GitHub skill**:

```markdown
**Scenario 1 (Most common)**:

- User query: "Find all open PRs in the composiohq/rube repository"
- Expected: List of PR titles, authors, URLs
- Required: GitHub API search, repository tools

**Scenario 2 (Complex)**:

- User query: "Show me all issues created this week with 'bug' label, sorted by comments"
- Expected: Filtered list with metadata
- Required: Date filtering, label filtering, sorting

**Scenario 3 (Cross-skill)**:

- User query: "Search for testing patterns and update the testing documentation"
- Expected: Search + documentation update
- Required: Integration with testing skill (if exists)
```

---

### 1.4: Identify Common Patterns

**TODO**: `add-skill-1.4: Identify common patterns across examples`

**Actions**:

1. Mark TODO `in_progress`
2. Analyze scenarios for patterns:
    - What operations repeat? (search, filter, extract)
    - What data structures appear? (lists, metadata, timestamps)
    - What error cases exist? (not found, auth failure, rate limits)
3. Identify trigger phrases:
    - Keywords: "search GitHub", "find repository", "list issues"
    - Patterns: Working with git repositories, pull requests, issues
4. Note what makes this skill unique vs existing skills
5. Mark `completed` after patterns identified

**Completion Criteria**: Clear understanding of skill scope, triggers, and common operations

**Example patterns for GitHub skill**:

- **Operations**: search (repos, issues, PRs), read (file contents), list (contributors)
- **Data**: Repository metadata, issue/PR details, file contents
- **Triggers**: "GitHub", "repository", "PR", "issue", "git"
- **Unique value**: Cross-repo search, metadata extraction, integration with project docs

---

## Output

At completion, you should have:

1. **3-5 concrete scenarios** with user queries and expected outcomes
2. **Trigger phrase list** (keywords and patterns)
3. **Common operations** identified across scenarios
4. **Scope boundaries** defined (what's included vs excluded)

**Next Step**: Load `steps/02-plan-resources.md` to turn scenarios into resource plan
