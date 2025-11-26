# Standardized TODO Taxonomy for Skills

## Format Specification

```
[skill-name]-[step].[subtask]: [Clear 5-8 word description]
```

**Components**:

1. **Skill Name**: Prevents collision across skills (see full list below)
2. **Step Number**: Workflow position (1, 2, 3, 4, 5, 6...)
3. **Subtask** (optional): Decimal for tactical work (1.1, 1.2, 1.3...)
4. **Description**: Actionable, specific, 5-8 words

**All Skill Names**:

- Meta: `add-skill`
- Organization: `branching`, `issue-management`, `pushing-code`, `code-review`
- Quality: `debugging`, `testing`, `linting`, `refactoring`
- Frontend: `branding`, `components`, `accessibility`, `animations`
- Backend: `api-design`, `database`, `authentication`, `validation`
- Infrastructure: `deployment`, `performance`

## Examples by Skill

**Note**: Hub skills (`_hub-organization`, `_hub-quality`, etc.) don't use TODOs directly. They route to sub-skills which have their own TODOs.

### add-skill (Multi-Step Skill)

```
add-skill-1: Understand skill with concrete examples
  add-skill-1.1: Gather use cases from user
  add-skill-1.2: Generate representative scenarios
  add-skill-1.3: Identify trigger phrases
add-skill-2: Plan reusable resources (scripts, references, assets)
add-skill-3: Create directory structure and initialize files
add-skill-4: Write SKILL.md with comprehensive description
add-skill-5: Implement bundled resources with tests
add-skill-6: Register skill and verify triggering
```

### testing

```
testing-1: Set up test environment
  testing-1.1: Configure Jest for unit tests
  testing-1.2: Set up Playwright for E2E
testing-2: Write unit tests for component
testing-3: Write integration tests for API
testing-4: Write E2E tests for user flow
testing-5: Verify all tests pass
```

### debugging

```
debugging-1: Reproduce the error consistently
debugging-2: Isolate the failing component
debugging-3: Understand the root cause
debugging-4: Implement minimal fix
debugging-5: Verify fix and check regression
```

### branching

```
branching-1: Check for existing branches for issue
branching-2: Create branch with naming convention
branching-3: Push branch to remote
```

### issue-management

```
issue-management-1: Understand feature requirements
issue-management-2: Create issue with proper structure
issue-management-3: Add labels and assignee
issue-management-4: Start work on issue
```

### pushing-code

```
pushing-code-1: Stage relevant changes
pushing-code-2: Write conventional commit message
pushing-code-3: Push to remote branch
pushing-code-4: Update GitHub issue with progress
```

### code-review

```
code-review-1: Understand PR context and requirements
code-review-2: High-level review of approach
code-review-3: Detailed code quality review
code-review-4: Test coverage review
code-review-5: Provide feedback with appropriate prefixes
```

### linting

```
linting-1: Identify the lint/type error
linting-2: Understand the ESLint/TypeScript rule
linting-3: Apply appropriate fix
linting-4: Verify error is resolved
```

### refactoring

```
refactoring-1: Ensure test coverage exists
refactoring-2: Identify code smell to address
refactoring-3: Make small, focused change
refactoring-4: Run tests to verify behavior
refactoring-5: Commit refactoring separately
```

### components

```
components-1: Check existing components for reuse
components-2: Determine atomic level (atom/molecule/organism)
components-3: Create component with proper structure
components-4: Add tests for component
components-5: Export from barrel file
```

### accessibility

```
accessibility-1: Add semantic HTML elements
accessibility-2: Add ARIA labels and roles
accessibility-3: Implement keyboard navigation
accessibility-4: Test with screen reader
accessibility-5: Verify color contrast
```

### animations

```
animations-1: Identify animation purpose (feedback/guide/delight)
animations-2: Choose appropriate duration and easing
animations-3: Implement with Tailwind transitions
animations-4: Add reduced motion support
```

### api-design

```
api-design-1: Define request/response schemas with Zod
api-design-2: Implement route handler or server action
api-design-3: Add authentication checks
api-design-4: Add error handling
api-design-5: Test endpoint manually or with tests
```

### database

```
database-1: Design schema changes in Prisma
database-2: Create migration with descriptive name
database-3: Generate Prisma client
database-4: Implement queries with proper relations
database-5: Test database operations
```

### authentication

```
authentication-1: Configure Auth.js provider
authentication-2: Add session callbacks if needed
authentication-3: Protect routes with middleware
authentication-4: Test auth flow end-to-end
```

### validation

```
validation-1: Define Zod schema for input
validation-2: Add validation to form/API handler
validation-3: Handle validation errors appropriately
validation-4: Display user-friendly error messages
```

### deployment

```
deployment-1: Verify local build succeeds
deployment-2: Configure environment variables in Vercel
deployment-3: Run database migrations
deployment-4: Deploy and verify production
deployment-5: Monitor for errors
```

### performance

```
performance-1: Measure current performance (Lighthouse/Analytics)
performance-2: Identify bottlenecks
performance-3: Implement optimization
performance-4: Re-measure to verify improvement
```

## Status Progression Rules

### CRITICAL: Mark `completed` ONLY After Work Is Done

**Correct**:

```
1. Create TODO: status = "pending"
2. Begin work: status = "in_progress"
3. Execute the work
4. Verify completion criteria met
5. Mark status = "completed" ← ONLY AFTER VERIFICATION
```

**Wrong (Anti-Pattern)**:

```
1. Create TODO: status = "pending"
2. Mark status = "in_progress" AND "completed" immediately ← TOO EARLY
3. Then do the work ← TODO says complete but work not done
```

### Verification Before Completion

**Before marking any TODO `completed`**:

1. Read the **Completion Criteria** for that step
2. Verify ALL criteria are met
3. Check outputs exist and are correct
4. THEN mark `completed`

**Example**:

```
Step: testing-2: Write unit tests for component

Before marking completed, verify:
✓ Test file exists at correct location
✓ Tests cover happy path and edge cases
✓ All tests pass when running `npm test`
✓ No linter errors in test file

Only then: Mark completed
```

## Cross-Skill TODO Management

When one skill triggers another:

```
Parent Skill TODO: issue-management-4 [in_progress]
  ↓ Triggers child skill: branching
  ↓ Create child TODOs:
    branching-1 [pending → in_progress → completed]
    branching-2 [pending → in_progress → completed]
  ↓ All child TODOs complete
  ↓ Return to parent with results
Parent Skill TODO: issue-management-4 [completed]
```

Skill names prevent ID collisions.

## Hierarchy Visibility

TODO list shows:

```
✅ add-skill-1: Understand skill... [completed]
✅ add-skill-2: Plan reusable resources... [completed]
✅ add-skill-3: Create directory structure... [completed]
⏳ add-skill-4: Write SKILL.md... [in_progress]
⬜ add-skill-5: Implement bundled resources... [pending]
⬜ add-skill-6: Register skill and verify... [pending]
```

Clear view of:

- Overall progress (6 strategic steps)
- Current focus (step 4)
- Tactical work within current step

---

_Established November 2025, updated November 26, 2025 for the Learning App (Cognia) project._
