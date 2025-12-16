# Features Documentation

This folder contains all feature documentation for the learning platform, organized by document type.

## Folder Structure

```
docs/features/
├── README.md                    # This file
├── specifications/              # Detailed technical specifications
│   ├── _TEMPLATE.md            # Template for new specs
│   └── *.md                    # Individual spec documents
│
├── requirements/                # User-facing requirements
│   ├── user-stories/           # User stories (US-X.X format)
│   │   ├── _TEMPLATE.md
│   │   └── *.md
│   └── prds/                   # Product Requirements Documents
│       └── *.md
│
├── architecture/               # High-level design decisions
│   ├── _TEMPLATE.md           # ADR template
│   └── decisions/             # Architecture Decision Records
│       └── *.md
│
├── design/                    # UI/UX design documentation
│   └── *.md                   # Wireframes, mockups, design specs
│
└── reference/                 # External patterns, guides, research
    └── *.md
```

## Document Types

### Specifications (`specifications/`)

Detailed technical specifications for core systems and algorithms. These documents describe **how** something works at an implementation level.

**When to use:** Documenting algorithms, data models, system behaviors, API contracts.

**Examples:**

- Spaced repetition algorithm
- Question generation system
- Progress prediction formulas

### Requirements (`requirements/`)

User-facing requirements that describe **what** the system should do from the user's perspective.

#### User Stories (`requirements/user-stories/`)

Short, focused documents using the US-X.X numbering format.

#### PRDs (`requirements/prds/`)

Longer product requirements documents for major features.

### Architecture (`architecture/`)

High-level design decisions and patterns. Uses Architecture Decision Records (ADRs) to capture significant technical decisions.

**When to use:** Recording why we chose a particular approach, documenting system-wide patterns.

### Design (`design/`)

UI/UX documentation including wireframes, mockups, and design specifications.

### Reference (`reference/`)

External patterns, research, and reference implementations. These are documents we've gathered from elsewhere or detailed guides for specific approaches.

---

## Document Status

Each document should include a metadata section with status:

| Status        | Meaning                              |
| ------------- | ------------------------------------ |
| `Draft`       | Being written, not ready for review  |
| `Review`      | Ready for feedback                   |
| `Approved`    | Signed off, ready for implementation |
| `Implemented` | Feature is in code                   |
| `Deprecated`  | No longer relevant                   |

---

## Document Metadata Template

Add this to the top of each document:

```markdown
<!--
Status: Draft | Review | Approved | Implemented | Deprecated
Created: YYYY-MM-DD
Issue: #XX (if applicable)
Owner: Name
-->
```

---

## Related Specifications

When documents are interconnected, include a "Related Specifications" section:

```markdown
## Related Specifications

| Spec                   | Relationship                |
| ---------------------- | --------------------------- |
| [Spec Name](./path.md) | Description of relationship |
```

---

## Quick Links

### Specifications

- [Course Structure & Navigation](./specifications/course-structure-navigation.md)
- [Spaced Repetition Algorithm](./specifications/spaced-repetition-algorithm.md)
- [Question Generation](./specifications/question-generation.md)
- [Information Point Generation](./specifications/information-point-generation.md)
- [Learning & Interaction Modes](./specifications/learning-interaction-modes.md)
- [Progress Prediction & Visualization](./specifications/progress-prediction.md)
- [Data Collection & Analytics](./specifications/data-collection-analytics.md)

### Requirements

- [Onboarding Flow](./requirements/user-stories/onboarding-flow.md)

### Reference

- [AI Assistant Architecture](./reference/ai-assistant-architecture.md)
