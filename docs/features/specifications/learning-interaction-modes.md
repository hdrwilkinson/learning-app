# Learning & Interaction Modes

<!--
Status: Draft
Created: 2025-11-30
Issue: #15 (Q9)
Owner: Harry
-->

> Design specification for Course Modes (Learn, Quiz, Reflect) and the Explore feature.

## Related Specifications

| Spec                                                              | Relationship                                             |
| ----------------------------------------------------------------- | -------------------------------------------------------- |
| [Course Structure & Navigation](./course-structure-navigation.md) | Defines lesson/IP hierarchy that Course Modes operate on |
| [Spaced Repetition Algorithm](./spaced-repetition-algorithm.md)   | Provides mastery data, receives quiz results             |
| [Question Generation](./question-generation.md)                   | Generates quiz content for Quiz Mode                     |

## Overview

Cognia provides two categories of interaction:

1. **Course Modes** (Learn, Quiz, Reflect) — Directly tied to Information Points in courses. These form the core learning loop with mastery tracking.
2. **Explore** (Curiosity) — Free-form conversation, separate from course structure. Like ChatGPT, users can ask anything without IP constraints.

All interactions share a **core chat component** that renders Markdown + React components with dynamic system prompts.

---

## Core Chat Component

A reusable chat interface used across all interactive modes.

### Capabilities

| Feature                    | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| **Markdown rendering**     | Full Markdown support including code blocks, tables, lists             |
| **React components**       | Embedded interactive elements (diagrams, quizzes, expandable sections) |
| **Dynamic system prompts** | Base prompt + context injection (IP/lesson/course)                     |
| **History persistence**    | All conversations saved to database                                    |
| **Tool use**               | AI can invoke tools based on mode context                              |

### Architecture

```typescript
interface ChatConfig {
    mode: "learn" | "quiz" | "curiosity" | "reflection";

    // Context injection
    context: {
        courseId?: string;
        lessonId?: string;
        informationPointId?: string;
        quizQuestionId?: string; // For reflection mode
    };

    // Dynamic prompt composition
    systemPrompt: {
        base: string; // Mode-specific base prompt
        contextual: string; // Injected from IP/lesson/course content
        constraints?: string; // Mode-specific boundaries
    };

    // Persistence
    sessionId: string;
    saveHistory: boolean;
}
```

### System Prompt Composition

```
┌─────────────────────────────────────────────────────────────────┐
│  BASE PROMPT (per mode)                                         │
│  "You are a tutor helping a student learn..."                   │
├─────────────────────────────────────────────────────────────────┤
│  CONTEXTUAL INJECTION                                           │
│  - Information Point content                                    │
│  - Lesson objectives                                            │
│  - Course subject area                                          │
│  - Prerequisite IP summaries                                    │
├─────────────────────────────────────────────────────────────────┤
│  CONSTRAINTS (optional)                                         │
│  - "Stay focused on [topic]"                                    │
│  - "Do not reveal quiz answers"                                 │
│  - "Guide student to discover, don't just tell"                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mode 1: Learn Mode

**Purpose**: Introduce users to Information Points sequentially, ensuring comprehension before progression.

### Entry Points

- Click "Available" lesson on course path
- Click "Continue Learning" on in-progress lesson
- Resume from dashboard

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LEARN MODE FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                                │
│  │  Enter       │                                                │
│  │  Learn Mode  │                                                │
│  └──────┬───────┘                                                │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐      ┌──────────────┐                         │
│  │  Present IP  │      │  Re-explain  │◄────────────────┐       │
│  │  via Chat    │      │  IP          │                 │       │
│  └──────┬───────┘      └──────┬───────┘                 │       │
│         │                      │                         │       │
│         ▼                      ▼                         │       │
│  ┌──────────────────────────────────────┐               │       │
│  │  User Interacts (asks questions,     │               │       │
│  │  requests examples, says "I got it") │               │       │
│  └──────────────┬───────────────────────┘               │       │
│                 │                                        │       │
│                 ▼                                        │       │
│  ┌──────────────────────────────────────┐               │       │
│  │  User Clicks "Next"                  │               │       │
│  └──────────────┬───────────────────────┘               │       │
│                 │                                        │       │
│                 ▼                                        │       │
│  ┌──────────────────────────────────────┐               │       │
│  │  System Decision (Algorithmic)       │               │       │
│  │  ─────────────────────────────────── │               │       │
│  │  Continue to next IP?                │               │       │
│  │  OR                                  │               │       │
│  │  Trigger Completion Check?           │               │       │
│  └──────────────┬───────────────────────┘               │       │
│                 │                                        │       │
│        ┌────────┴────────┐                              │       │
│        ▼                 ▼                              │       │
│  ┌───────────┐    ┌─────────────────┐                   │       │
│  │  Next IP  │    │  Completion     │                   │       │
│  │           │    │  Check (2-3 Qs) │                   │       │
│  └─────┬─────┘    └────────┬────────┘                   │       │
│        │                   │                            │       │
│        │          ┌────────┴────────┐                   │       │
│        │          ▼                 ▼                   │       │
│        │    ┌──────────┐     ┌──────────┐              │       │
│        │    │  Pass    │     │  Fail    │──────────────┘       │
│        │    └────┬─────┘     └──────────┘                       │
│        │         │                                              │
│        └────┬────┘                                              │
│             │                                                   │
│             ▼                                                   │
│  ┌──────────────────────────────────────┐                      │
│  │  More IPs in Lesson?                 │                      │
│  │  YES → Loop to "Present IP"          │                      │
│  │  NO  → Lesson Complete               │                      │
│  └──────────────────────────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Completion Check

Mini-quiz triggered algorithmically to verify understanding.

```typescript
interface CompletionCheck {
    // Question sources
    sources: {
        currentIP: boolean; // Always include
        prerequisiteIPs: boolean; // IPs that current relies on
        recentlyIntroducedIPs: boolean; // From this session
    };

    questionCount: 2 | 3; // Small, quick check

    // NOT LLM-based - uses pre-generated questions
    questionSource: "pre_generated";

    // Prefer simpler types for quick checks
    preferredTypes: ["binary", "multiple_choice"];
}

// Trigger algorithm (not LLM-based)
interface CompletionCheckTrigger {
    // Factors that increase trigger probability
    factors: {
        ipsSinceLastCheck: number; // More IPs = higher chance
        complexityOfCurrentIP: number; // Complex IPs trigger more checks
        randomFactor: number; // Add some unpredictability
    };

    // Minimum IPs before any check possible
    minimumIPsBeforeCheck: 2;

    // Maximum IPs without a check
    maximumIPsWithoutCheck: 5;
}
```

### On Completion Check Failure

1. System identifies which IP(s) the user struggled with
2. AI re-explains the specific IP(s) with different approach
3. User can ask follow-up questions
4. After re-explanation, user clicks "Next" again
5. Loop until user passes check

### IP State Transitions

```typescript
// After Learn Mode introduction
ipProgress.state = "introduced"; // Now quiz-eligible

// After passing completion check
ipProgress.state = "learning";
ipProgress.currentMastery = 0.2; // Starting point
```

### System Prompt (Learn Mode)

```typescript
const learnModePrompt = {
    base: `You are a patient, encouraging tutor introducing new concepts.
Your goal is to help the student understand the following information point clearly.

Guidelines:
- Start with a clear, concise explanation
- Use analogies and examples when helpful
- Break complex ideas into digestible parts
- Encourage questions
- Confirm understanding before moving on
- If the student says "I got it", ask 1-2 quick verification questions`,

    contextual: `
Information Point: ${ip.title}
Content: ${ip.content}
Prerequisites: ${ip.prerequisites.map((p) => p.summary).join("; ")}
Lesson Context: ${lesson.title} - ${lesson.description}`,

    constraints: `
- Stay focused on this specific information point
- Reference prerequisites when relevant for context
- Do not jump ahead to later topics in the course`,
};
```

---

## Mode 2: Quiz Mode

**Purpose**: Test and reinforce knowledge through varied question types.

### Entry Points

- Click "Learning" or "Mastered" lesson on course path
- "Daily Review" from dashboard
- "Study Now" floating action button
- End of Learn Mode session

### Question Types

| Type                  | Description                | Mastery Reward | Stability Multiplier |
| --------------------- | -------------------------- | -------------- | -------------------- |
| **Binary (T/F)**      | True/false statements      | +0.05          | 1.0                  |
| **Multiple Choice**   | 4 options, 1 correct       | +0.10          | 1.2                  |
| **Question & Answer** | Free-form written response | +0.15          | 1.5                  |

> Wrong answer penalty is fixed at **-0.15** regardless of question type.

### Quiz Configuration

```typescript
interface QuizSession {
    mode: "daily_review" | "lesson_focus" | "course_wide";

    // Question selection (from spaced repetition algorithm)
    questionSource: "due_items" | "lesson_specific" | "mixed";

    // Timing
    timed: boolean;
    timeLimit?: number; // seconds per question (if timed)

    // Reflection options
    reflectionEnabled: boolean;

    // Session limits
    maxQuestions?: number;
    targetDuration?: number; // minutes
}
```

### Timed Quiz Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Question Presented (Timer Running)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Actions:                                                  │
│                                                                 │
│  [Answer] ────────────────► Correct? ──► Next Question          │
│                                 │                               │
│                                 ▼                               │
│                              Wrong ──────► [Reflect Now?]       │
│                                                │                │
│                    ┌───────────┬───────────────┼────────────┐   │
│                    ▼           ▼               ▼            │   │
│              ┌──────────┐ ┌──────────┐  ┌───────────┐       │   │
│              │ Exit     │ │ Stay in  │  │ Queue for │       │   │
│              │ Timed    │ │ Timed    │  │ End       │       │   │
│              │ Mode     │ │ Mode     │  │           │       │   │
│              └────┬─────┘ └────┬─────┘  └─────┬─────┘       │   │
│                   │            │              │             │   │
│                   ▼            ▼              │             │   │
│              Timer stops   Timer runs     Next Question ◄───┘   │
│              Reflection    during          (mark for later)     │
│              opens         reflection                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Reflection Queue (Timed Quizzes)

```typescript
interface ReflectionQueue {
    items: Array<{
        questionId: string;
        ipId: string;
        userAnswer?: string;
        correctAnswer: string;
        queuedAt: Date;
    }>;

    // Processed at end of quiz
    processAfterQuiz: boolean;
}
```

---

## Explore (Curiosity Mode)

> **Note:** Explore is a separate feature from Course Modes. It is not tied to Information Points and does not affect mastery tracking.

**Purpose**: Free-form exploration and discovery, either within or outside a course context.

### Entry Points

- "Explore" or "Ask Anything" from dashboard
- "Curiosity" tab within a course
- Natural conversation pivot from other modes

### Two Contexts

| Context       | System Prompt Adjustments      | Tool Access           | Save Capability        |
| ------------- | ------------------------------ | --------------------- | ---------------------- |
| **In-Course** | Course/lesson context injected | Course-specific tools | Add to existing course |
| **General**   | Broad knowledge base           | General tools         | Create new course      |

### In-Course Curiosity

```typescript
interface InCourseCuriosity {
    courseId: string;

    // Context available to AI
    context: {
        courseTitle: string;
        courseDescription: string;
        completedModules: Module[];
        currentProgress: number;
        allIPSummaries: string[]; // For reference
    };

    // Save discovery action
    saveDiscovery: {
        enabled: true;
        targetOptions: ["new_ip_in_lesson", "new_lesson", "notes"];
    };
}
```

### General Curiosity

```typescript
interface GeneralCuriosity {
    // No course context
    courseId: null;

    // Broader capabilities
    tools: ["web_search", "knowledge_base", "create_course"];

    // Save discovery action
    saveDiscovery: {
        enabled: true;
        targetOptions: ["new_course", "notes"];
    };
}
```

### Save Discovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  User in Curiosity Mode                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User: "That's interesting, I want to save this"                │
│        OR clicks [Save Discovery] button                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  In-Course Context:                                         ││
│  │  ────────────────────                                       ││
│  │  [Add as new IP to current lesson]                          ││
│  │  [Create new lesson in this module]                         ││
│  │  [Save to personal notes]                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  General Context:                                           ││
│  │  ─────────────────                                          ││
│  │  [Create new course from this topic]                        ││
│  │      → Enters Course Creation Flow (Issue #15 - Q13)        ││
│  │  [Save to personal notes]                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Prompt (Curiosity Mode)

```typescript
const curiosityModePrompt = {
    base: `You are a knowledgeable companion helping the user explore topics freely.

Guidelines:
- Follow the user's curiosity wherever it leads
- Provide rich, interesting information
- Make connections between topics when relevant
- Suggest related areas they might find interesting
- If they discover something worth saving, offer to help structure it`,

    contextual: inCourse
        ? `Course Context: ${course.title}
       Current Progress: ${progress}% through the course
       Topics Covered: ${completedTopics.join(", ")}`
        : `General exploration mode - all topics welcome`,

    constraints: inCourse
        ? `While free to explore, you can reference how topics connect to the course content`
        : `No constraints - follow curiosity freely`,
};
```

---

## Reflect Mode

**Purpose**: Help users understand concepts they struggled with during quizzes. This is a Course Mode, directly tied to Information Points.

### Entry Points

- After wrong answer in Quiz Mode
- Before answering (skips the question)
- From reflection queue at end of timed quiz

### Scope Constraints

Reflection is **scoped to the current question/IP**. The AI guides the user back to understanding the specific concept.

```typescript
interface ReflectionSession {
    // Tight scope
    questionId: string;
    informationPointId: string;

    // Context for AI
    context: {
        originalQuestion: string;
        userAnswer?: string;
        correctAnswer: string;
        ipContent: string;
        prerequisiteIPs: InformationPoint[];
    };

    // Prompting constraint
    stayOnTopic: true;

    // Exit options
    exitBehavior: {
        returnToQuiz: boolean;
        offerToExitQuizEntirely: boolean;
    };
}
```

### Reflection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  REFLECTION MODE                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────┐                      │
│  │  "Let's understand this better..."   │                      │
│  │                                      │                      │
│  │  Your answer: [user's response]      │                      │
│  │  The concept: [IP summary]           │                      │
│  └──────────────────────────────────────┘                      │
│                                                                 │
│  AI explains the concept, focusing on where                    │
│  the user's understanding may have gaps                         │
│                                                                 │
│  User can:                                                      │
│  ├── Ask clarifying questions (about this IP)                  │
│  ├── Request examples                                          │
│  ├── Say "I understand now" → [Return to Quiz]                 │
│  └── "I want to learn something else" →                        │
│      AI prompts: "Would you like to exit the quiz              │
│      and explore freely?"                                       │
│          ├── Yes → Exit to Curiosity Mode                      │
│          └── No → Continue reflection on this topic            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Prompt (Reflection Mode)

```typescript
const reflectionModePrompt = {
    base: `You are helping a student understand a concept they struggled with in a quiz.

Guidelines:
- Start by acknowledging what they got right (if anything)
- Gently identify the misconception or gap
- Re-explain the concept from a different angle
- Use examples and analogies
- Check their understanding before they return to the quiz`,

    contextual: `
Question: ${question.text}
User's Answer: ${userAnswer ?? "They chose to reflect before answering"}
Correct Answer: ${question.correctAnswer}
Information Point: ${ip.title}
Content: ${ip.content}
Prerequisites: ${ip.prerequisites.map((p) => p.summary).join("; ")}`,

    constraints: `
IMPORTANT: Stay focused on this specific question and information point.
If the user wants to explore unrelated topics, offer to exit the quiz first.
Do not reveal answers to other quiz questions.`,
};
```

---

## Chat History Management

All chat interactions are persisted for learning analytics and continuity.

### Storage Structure

```typescript
interface ChatMessage {
    id: string;
    sessionId: string;

    // Context
    mode: "learn" | "quiz" | "curiosity" | "reflection";
    courseId?: string;
    lessonId?: string;
    ipId?: string;

    // Content
    role: "user" | "assistant" | "system";
    content: string;

    // Metadata
    timestamp: Date;
    tokens?: number;
}

interface ChatSession {
    id: string;
    userId: string;
    mode: string;

    // Context at session start
    context: ChatConfig["context"];

    // Timestamps
    startedAt: Date;
    endedAt?: Date;

    // Aggregates
    messageCount: number;
    totalTokens: number;
}
```

### History Retrieval

```typescript
// When entering a mode, can load relevant history
interface HistoryRetrieval {
    // Most recent session for same IP (useful for Learn/Reflection)
    byIP: (ipId: string) => ChatSession[];

    // All curiosity sessions for a course
    byCourse: (courseId: string) => ChatSession[];

    // General curiosity sessions
    generalCuriosity: () => ChatSession[];
}
```

---

## Mode Transitions

### Course Mode Loop (IP-based)

The three Course Modes form a connected learning loop:

```
┌─────────────────────────────────────────────────────────────────┐
│                    COURSE MODE TRANSITIONS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEARN MODE ─────────────────────────────────────────┐          │
│       │                                              │          │
│       │ (Lesson complete)                            │          │
│       ▼                                              │          │
│  ┌─────────┐                                         │          │
│  │  QUIZ   │◄──────── "Daily Review"                │          │
│  │  MODE   │◄──────── "Study Now"                   │          │
│  └────┬────┘                                         │          │
│       │                                              │          │
│       │ (Wrong answer / reflect before answering)   │          │
│       ▼                                              │          │
│  ┌────────────┐                                      │          │
│  │ REFLECT    │──── "Return to Quiz" ───► QUIZ MODE │          │
│  │   MODE     │                                      │          │
│  └────────────┘                                      │          │
│       │                                              │          │
│       │ (New content from Explore)                  │          │
│       ▼                                              │          │
│  New IP ─────── enter LEARN MODE ────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Explore (Separate Feature)

Explore is independent from the Course Mode loop but can feed into it:

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXPLORE (CURIOSITY)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐                                                 │
│  │  EXPLORE   │◄──────── "Explore" from dashboard               │
│  │            │◄──────── "Explore" tab in course                │
│  │            │◄──────── Exit from any Course Mode              │
│  └────┬───────┘                                                 │
│       │                                                         │
│       │ (Save discovery as new content)                         │
│       ▼                                                         │
│  ┌────────────────────────────────────────────┐                 │
│  │ COURSE CREATION FLOW (if new course)       │                 │
│  │ OR                                         │                 │
│  │ ADD TO COURSE (if in-course explore)       │                 │
│  │ → New IP enters LEARN MODE                 │ ───► Course     │
│  └────────────────────────────────────────────┘      Modes      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI Considerations

### Mode Indicators

Each mode should have distinct visual treatment:

**Course Modes (IP-based):**

| Mode    | Color Theme      | Icon | Header Text             |
| ------- | ---------------- | ---- | ----------------------- |
| Learn   | Blue/Calm        | 📖   | "Learning: [IP Title]"  |
| Quiz    | Orange/Focus     | ❓   | "Quiz: [Lesson Name]"   |
| Reflect | Green/Supportive | 💡   | "Let's understand this" |

**Explore (Separate Feature):**

| Feature | Color Theme    | Icon | Header Text                        |
| ------- | -------------- | ---- | ---------------------------------- |
| Explore | Purple/Playful | 🔮   | "Explore" or "Exploring: [Course]" |

### Shared Chat Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mode Icon] [Mode Label]                    [Context Badge]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  [Chat messages with Markdown + React components]           ││
│  │                                                             ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │  AI: Here's an interactive diagram...               │   ││
│  │  │  [Rendered React Component: Diagram]                │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                                             ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │  User: Can you show me an example?                  │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Input field...]                              [Send] [Actions] │
│                                                                 │
│  Mode-specific actions:                                         │
│  Learn: [Next] [I got it]                                       │
│  Quiz: [Submit Answer] [Reflect]                                │
│  Reflect: [Return to Quiz] [Exit Quiz]                          │
│  Explore: [Save Discovery] [New Topic]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Future Considerations

1. **Voice Mode**: Audio input/output for hands-free learning
2. **Collaborative Learning**: Multiple users in same curiosity session
3. **Mode Blending**: Seamless transitions without explicit mode switches
4. **Adaptive Prompting**: System prompts evolve based on user's learning style
5. **Rich Media in Chat**: Video explanations, interactive simulations

---

## Open Questions

See Issue #15 for related open questions:

- **Q13**: How does adding Curiosity discoveries to an existing course work?
- **Q3**: Content format for Information Points (affects chat rendering)
