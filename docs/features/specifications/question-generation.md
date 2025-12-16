# Quiz Question Generation

<!--
Status: Draft
Created: 2025-11-30
Issue: #15
Owner: Harry
-->

> System specification for progressive, offline question generation using Gemini models.

## Related Specifications

| Spec                                                              | Relationship                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [Spaced Repetition Algorithm](./spaced-repetition-algorithm.md)   | Determines when questions are needed based on mastery         |
| [Information Point Generation](./information-point-generation.md) | Provides IP content and relationships for question generation |
| [Data Collection & Analytics](./data-collection-analytics.md)     | Tracks question performance for quality improvement           |

## Overview

Questions are pre-generated offline to ensure instant quiz experiences. Generation is triggered progressively as users advance, avoiding waste while maintaining adequate buffers.

### Core Principles

1. **Zero latency**: Questions always ready when user needs them
2. **Progressive generation**: Generate just-in-time, not all upfront
3. **Cost efficient**: Batch processing, appropriate model selection
4. **Variety**: Prevent repetition through buffers and cooldowns

---

## Model Selection

Using Google Gemini models for cost efficiency and startup-friendly free tiers.

| Quiz Type       | Model            | Reasoning                                               |
| --------------- | ---------------- | ------------------------------------------------------- |
| True/False      | Gemini 2.5 Flash | Simple binary generation, high volume                   |
| Multiple Choice | Gemini 2.5 Flash | Structured output, distractors need creativity          |
| Q&A             | Gemini 2.5 Flash | Quality questions + grading rubric generation           |
| Comparison      | Gemini 2.5 Flash | Cross-IP questions requiring relationship understanding |

**Note**: Upgrade to Gemini 3 Flash when available for improved quality at similar cost.

### Model Configuration

```typescript
const MODEL_CONFIG = {
    questionGeneration: {
        model: "gemini-2.5-flash",
        temperature: 0.7, // Some creativity for variety
        maxTokens: 1024, // Per question batch
    },

    answerGrading: {
        model: "gemini-2.5-flash",
        temperature: 0.2, // More deterministic for grading
        maxTokens: 512,
    },
};
```

---

## Question Data Models

### Generated Question

```typescript
interface GeneratedQuestion {
    id: string;
    informationPointId: string;
    secondaryIpId?: string; // For comparison questions
    quizTypeId: string;

    // === Question Content ===
    questionText: string;

    // === Type-specific fields ===

    // True/False
    correctAnswer?: boolean;
    explanation?: string;

    // Multiple Choice
    options?: MCOption[];
    correctOptionIndex?: number;

    // Q&A
    expectedAnswer?: string;
    gradingRubric?: GradingRubric;
    keyPoints?: string[]; // Points that must be in answer
    acceptableVariations?: string[];

    // Comparison (uses MC or Q&A format)
    comparisonType?: "difference" | "similarity" | "builds_on";
    ipPair?: [string, string]; // The two IPs being compared

    // === Metadata ===
    difficulty: "easy" | "medium" | "hard";
    generatedAt: Date;
    modelUsed: string;
    generationBatchId: string;

    // === Quality ===
    isActive: boolean; // Can be disabled if problematic
    reviewStatus: "pending" | "approved" | "rejected";
}

interface MCOption {
    text: string;
    isCorrect: boolean;
    whyWrong?: string; // Explanation for distractor
}

interface GradingRubric {
    fullCreditCriteria: string[];
    partialCreditCriteria: string[];
    commonMistakes: string[];
}
```

### Question Buffer

```typescript
interface QuestionBuffer {
    informationPointId: string;
    userId: string; // User-specific buffer tracking

    // Per quiz type
    buffers: Record<string, QuizTypeBuffer>;

    lastReplenishedAt: Date;
}

interface QuizTypeBuffer {
    quizTypeId: string;
    totalGenerated: number;
    totalUsed: number;
    available: number; // Computed: generated - used

    // Unused question IDs ready to serve
    availableQuestionIds: string[];
}
```

### Question Usage

```typescript
interface QuestionUsage {
    id: string;
    questionId: string;
    userId: string;

    // === History ===
    timesShown: number;
    lastShownAt: Date;

    // === Cooldown ===
    nextEligibleAt: Date; // Can show again after this
    isRetired: boolean; // Max repeats reached

    // === Results ===
    wasCorrectLastTime: boolean;
}
```

---

## Generation Triggers

### Trigger 1: Course Start

When user enrolls/starts a course.

```typescript
async function onCourseStart(userId: string, courseId: string): Promise<void> {
    const firstLesson = getFirstLesson(courseId);

    for (const ip of firstLesson.informationPoints) {
        await generateInitialQuestions(ip.id, {
            binary: 5,
            multiple_choice: 5,
        });
    }
}
```

### Trigger 2: Lesson Unlock

When user unlocks a new lesson.

```typescript
async function onLessonUnlock(userId: string, lessonId: string): Promise<void> {
    const lesson = getLesson(lessonId);

    for (const ip of lesson.informationPoints) {
        await generateInitialQuestions(ip.id, {
            binary: 5,
            multiple_choice: 5,
        });
    }
}
```

### Trigger 3: Mastery Threshold

When user approaches Q&A unlock threshold.

```typescript
async function onMasteryUpdate(
    userId: string,
    ipId: string,
    newMastery: number
): Promise<void> {
    const QA_GENERATION_THRESHOLD = 0.3;
    const QA_UNLOCK_THRESHOLD = 0.4;

    // Generate Q&A when user is getting close to unlocking it
    if (newMastery >= QA_GENERATION_THRESHOLD) {
        const buffer = await getBuffer(userId, ipId, "question_answer");

        if (buffer.totalGenerated === 0) {
            await generateQuestions(ipId, "question_answer", 6);
        }
    }
}
```

### Trigger 4: Buffer Replenishment

When available questions run low.

```typescript
async function checkAndReplenishBuffer(
    userId: string,
    ipId: string,
    quizTypeId: string
): Promise<void> {
    const buffer = await getBuffer(userId, ipId, quizTypeId);
    const config = BUFFER_CONFIG[quizTypeId];

    if (buffer.available < config.minimumBuffer) {
        await generateQuestions(ipId, quizTypeId, config.replenishmentBatch);
    }
}
```

### Trigger 5: Nightly Background Job

Proactive generation during off-peak hours.

```typescript
async function nightlyQuestionGeneration(): Promise<void> {
  const activeUsers = await getActiveUsers(lastActiveDays: 7);

  for (const user of activeUsers) {
    // Predict what IPs user will encounter in next 7 days
    const upcomingIPs = await predictUpcomingIPs(user.id, days: 7);

    for (const ip of upcomingIPs) {
      const buffers = await getAllBuffers(user.id, ip.id);

      for (const [quizTypeId, buffer] of Object.entries(buffers)) {
        const config = BUFFER_CONFIG[quizTypeId];

        if (buffer.available < config.minimumBuffer) {
          await queueForGeneration(ip.id, quizTypeId, config.replenishmentBatch);
        }
      }
    }
  }

  // Process queue in batches for efficiency
  await processGenerationQueue();
}
```

---

## Buffer Configuration

```typescript
const BUFFER_CONFIG = {
    binary: {
        initialGeneration: 5,
        minimumBuffer: 2,
        replenishmentBatch: 4,
    },

    multiple_choice: {
        initialGeneration: 5,
        minimumBuffer: 2,
        replenishmentBatch: 4,
    },

    question_answer: {
        initialGeneration: 0, // Generated on mastery threshold
        qaThresholdGeneration: 6, // Generated at 30% mastery
        minimumBuffer: 2,
        replenishmentBatch: 4,
    },

    comparison: {
        initialGeneration: 0, // Generated when both IPs unlocked
        perPairGeneration: 3, // Questions per IP pair
        minimumBuffer: 1,
        replenishmentBatch: 2,
    },
};

// Threshold to trigger Q&A generation (before unlock at 40%)
const QA_GENERATION_THRESHOLD = 0.3;
```

---

## Question Reuse & Cooldown

### Reuse Strategy

- **First 3 reviews**: Show unique questions only
- **After IP mastered**: Can repeat questions with cooldown
- **After lapse**: Reset to unique questions

### Cooldown Calculation

```typescript
const COOLDOWN_CONFIG = {
    initialCooldownDays: 14,
    cooldownMultiplier: 1.5,
    maxRepeats: 3,
};

function calculateNextEligible(usage: QuestionUsage): Date {
    if (usage.timesShown >= COOLDOWN_CONFIG.maxRepeats) {
        // Retire the question
        return null;
    }

    const cooldownDays =
        COOLDOWN_CONFIG.initialCooldownDays *
        Math.pow(COOLDOWN_CONFIG.cooldownMultiplier, usage.timesShown - 1);

    return addDays(usage.lastShownAt, cooldownDays);
}
```

### Question Selection

```typescript
async function selectQuestion(
    userId: string,
    ipId: string,
    quizTypeId: string
): Promise<GeneratedQuestion> {
    // 1. Get available questions for this IP + type
    const buffer = await getBuffer(userId, ipId, quizTypeId);

    // 2. Filter to unused OR past cooldown
    const eligible = await filterEligibleQuestions(
        buffer.availableQuestionIds,
        userId
    );

    // 3. Prefer unused questions
    const unused = eligible.filter((q) => !q.hasBeenShown);
    if (unused.length > 0) {
        return randomSelect(unused);
    }

    // 4. Fall back to cooldown-eligible repeats
    const repeatable = eligible.filter((q) => q.pastCooldown && !q.isRetired);
    if (repeatable.length > 0) {
        return randomSelect(repeatable);
    }

    // 5. Trigger emergency generation (shouldn't happen with proper buffering)
    await generateQuestions(ipId, quizTypeId, 4);
    return selectQuestion(userId, ipId, quizTypeId); // Retry
}
```

---

## Generation Prompts

### True/False Generation

```typescript
const BINARY_PROMPT = `
You are generating True/False quiz questions for a learning application.

Information Point:
Title: {ip.title}
Content: {ip.content}

Generate {count} True/False questions that test understanding of this concept.

Requirements:
- Each question should be a clear statement that is definitively true or false
- Avoid trick questions or ambiguous wording
- Mix of true and false answers
- Vary difficulty: some straightforward, some requiring deeper understanding
- Include brief explanation for why the answer is correct

Output as JSON array:
[
  {
    "questionText": "Statement to evaluate",
    "correctAnswer": true,
    "explanation": "Why this is true/false",
    "difficulty": "easy|medium|hard"
  }
]
`;
```

### Multiple Choice Generation

```typescript
const MC_PROMPT = `
You are generating Multiple Choice quiz questions for a learning application.

Information Point:
Title: {ip.title}
Content: {ip.content}
Related concepts: {relatedIPs}

Generate {count} Multiple Choice questions with 4 options each.

Requirements:
- One clearly correct answer
- Three plausible but incorrect distractors
- Distractors should reflect common misconceptions
- Avoid "all of the above" or "none of the above"
- Vary difficulty levels
- Include explanation for why each distractor is wrong

Output as JSON array:
[
  {
    "questionText": "Question stem",
    "options": [
      {"text": "Option A", "isCorrect": true, "whyWrong": null},
      {"text": "Option B", "isCorrect": false, "whyWrong": "Why this is incorrect"},
      {"text": "Option C", "isCorrect": false, "whyWrong": "Why this is incorrect"},
      {"text": "Option D", "isCorrect": false, "whyWrong": "Why this is incorrect"}
    ],
    "difficulty": "easy|medium|hard"
  }
]
`;
```

### Q&A Generation

```typescript
const QA_PROMPT = `
You are generating open-ended Q&A questions for a learning application.

Information Point:
Title: {ip.title}
Content: {ip.content}
Prerequisites: {prerequisiteIPs}

Generate {count} questions that require written explanation.

Requirements:
- Questions should test deep understanding, not just recall
- Include a model answer
- Define key points that MUST be in a correct answer
- List acceptable variations in terminology/phrasing
- Include common mistakes to watch for in grading

Output as JSON array:
[
  {
    "questionText": "Open-ended question",
    "expectedAnswer": "Model answer paragraph",
    "keyPoints": ["Must mention X", "Must explain Y relationship"],
    "acceptableVariations": ["X can also be called Z", "Y synonym is W"],
    "commonMistakes": ["Often confused with...", "Students often forget..."],
    "difficulty": "easy|medium|hard"
  }
]
`;
```

### Comparison Question Generation

Comparison questions test understanding of relationships between IPs. Generated when both IPs in a pair are unlocked.

```typescript
const COMPARISON_PROMPT = `
You are generating comparison questions that test understanding of relationships between concepts.

Information Point A:
Title: {ipA.title}
Content: {ipA.content}

Information Point B:
Title: {ipB.title}
Content: {ipB.content}

Relationship: {relationshipType}
- "prerequisite": B builds on A
- "related": Conceptually similar/comparable

Generate {count} comparison questions.

Question types to generate:
1. Difference questions: "What is the key difference between A and B?"
2. Similarity questions: "What do A and B have in common?"
3. Build-on questions (if prerequisite): "How does B extend/improve on A?"

Requirements:
- Questions should require understanding of BOTH concepts
- Can be Multiple Choice or Q&A format
- Include why the comparison matters for learning

Output as JSON array:
[
  {
    "questionText": "Compare X and Y: ...",
    "comparisonType": "difference|similarity|builds_on",
    "format": "multiple_choice|question_answer",
    "options": [...] // if MC
    "expectedAnswer": "..." // if Q&A
    "keyPoints": ["Must mention...", "Should contrast..."],
    "difficulty": "medium|hard"
  }
]
`;
```

### Comparison Question Triggers

```typescript
async function checkComparisonEligibility(
    userId: string,
    ipId: string
): Promise<void> {
    const ip = await getIP(ipId);

    // Check related IPs
    for (const relatedId of ip.relatedPoints) {
        const relatedProgress = await getProgress(userId, relatedId);

        // Both IPs must be in 'learning' or 'mastered' state
        if (
            relatedProgress.state === "learning" ||
            relatedProgress.state === "mastered"
        ) {
            await generateComparisonQuestions(ipId, relatedId);
        }
    }

    // Check prerequisite relationships
    for (const prereqId of ip.prerequisites) {
        const prereqProgress = await getProgress(userId, prereqId);

        if (
            prereqProgress.state === "learning" ||
            prereqProgress.state === "mastered"
        ) {
            await generateComparisonQuestions(prereqId, ipId, "builds_on");
        }
    }
}
```

---

## Q&A Answer Grading

For Q&A questions, use Gemini to grade user responses.

```typescript
interface GradingResult {
    isCorrect: boolean;
    score: number; // 0-1 for partial credit
    feedback: string;
    missingKeyPoints: string[];
    incorrectStatements: string[];
}

const GRADING_PROMPT = `
You are grading a student's answer to a learning question.

Question: {question.questionText}

Expected answer key points:
{question.keyPoints}

Acceptable variations:
{question.acceptableVariations}

Common mistakes to check for:
{question.commonMistakes}

Student's answer:
{userAnswer}

Grade the answer and provide feedback.

Output as JSON:
{
  "isCorrect": boolean (true if all key points addressed),
  "score": number (0-1, partial credit),
  "feedback": "Constructive feedback for the student",
  "missingKeyPoints": ["Key point they missed"],
  "incorrectStatements": ["Anything they got wrong"]
}
`;

async function gradeQAResponse(
    question: GeneratedQuestion,
    userAnswer: string
): Promise<GradingResult> {
    const prompt = GRADING_PROMPT.replace(
        "{question.questionText}",
        question.questionText
    )
        .replace("{question.keyPoints}", JSON.stringify(question.keyPoints))
        .replace(
            "{question.acceptableVariations}",
            JSON.stringify(question.acceptableVariations)
        )
        .replace(
            "{question.commonMistakes}",
            JSON.stringify(question.commonMistakes)
        )
        .replace("{userAnswer}", userAnswer);

    const response = await gemini.generate({
        model: MODEL_CONFIG.answerGrading.model,
        prompt,
        temperature: MODEL_CONFIG.answerGrading.temperature,
    });

    return JSON.parse(response);
}
```

---

## Batch Processing

### Generation Queue

```typescript
interface GenerationJob {
    id: string;
    informationPointId: string;
    quizTypeId: string;
    count: number;
    priority: "high" | "normal" | "low";
    status: "pending" | "processing" | "completed" | "failed";
    createdAt: Date;
    processedAt: Date | null;
    error: string | null;
}

// Priority levels
// high: User is actively waiting (buffer critically low)
// normal: Standard replenishment
// low: Background/nightly jobs
```

### Batch Processor

```typescript
async function processGenerationQueue(): Promise<void> {
    // Group jobs by IP for context efficiency
    const jobs = await getPendingJobs();
    const groupedByIP = groupBy(jobs, "informationPointId");

    for (const [ipId, ipJobs] of Object.entries(groupedByIP)) {
        const ip = await getInformationPoint(ipId);

        // Generate all question types for this IP in one batch
        for (const job of ipJobs) {
            try {
                const questions = await generateQuestionBatch(
                    ip,
                    job.quizTypeId,
                    job.count
                );
                await saveQuestions(questions);
                await markJobCompleted(job.id);
            } catch (error) {
                await markJobFailed(job.id, error.message);
                // Retry logic handled by job scheduler
            }
        }
    }
}
```

---

## Cost Estimation

### Per-Question Cost (Gemini 2.5 Flash)

| Quiz Type                    | Input Tokens | Output Tokens | Est. Cost |
| ---------------------------- | ------------ | ------------- | --------- |
| True/False (batch of 5)      | ~500         | ~400          | ~$0.001   |
| Multiple Choice (batch of 5) | ~600         | ~800          | ~$0.002   |
| Q&A (batch of 6)             | ~700         | ~1200         | ~$0.003   |
| Q&A Grading (per answer)     | ~400         | ~200          | ~$0.0008  |

### Per-User Estimate

For a 100-IP course:

- Initial generation: ~100 × ($0.001 + $0.002) = ~$0.30
- Q&A generation: ~100 × $0.003 = ~$0.30
- Replenishment (estimated 50%): ~$0.30
- Q&A grading (estimated 400 Q&A attempts): ~$0.32

**Total per user completing a course: ~$1.20**

With Gemini free tier (generous for startups), initial users essentially free.

---

## Error Handling

### Generation Failures

```typescript
async function handleGenerationFailure(
    job: GenerationJob,
    error: Error
): Promise<void> {
    const MAX_RETRIES = 3;

    if (job.retryCount < MAX_RETRIES) {
        // Exponential backoff
        const delay = Math.pow(2, job.retryCount) * 1000;
        await scheduleRetry(job, delay);
    } else {
        // Alert for manual intervention
        await alertGenerationFailure(job, error);

        // Fall back: allow real-time generation for this user
        await enableRealTimeFallback(job.informationPointId);
    }
}
```

### Quality Checks

```typescript
async function validateGeneratedQuestions(
    questions: GeneratedQuestion[]
): Promise<GeneratedQuestion[]> {
    return questions.filter((q) => {
        // Basic validation
        if (!q.questionText || q.questionText.length < 10) return false;

        // Type-specific validation
        if (q.quizTypeId === "multiple_choice") {
            if (!q.options || q.options.length !== 4) return false;
            if (q.options.filter((o) => o.isCorrect).length !== 1) return false;
        }

        if (q.quizTypeId === "question_answer") {
            if (!q.keyPoints || q.keyPoints.length === 0) return false;
        }

        return true;
    });
}
```

---

## Implementation Priority

### Phase 1 (MVP)

- Basic generation for T/F and MC
- On-lesson-unlock trigger
- Simple buffer tracking

### Phase 2

- Q&A generation and grading
- Mastery threshold trigger
- Cooldown system

### Phase 3

- Nightly background job
- Advanced batching
- Quality monitoring

---

## Configuration Constants

```typescript
const QUESTION_GENERATION_CONFIG = {
    // Models
    generationModel: "gemini-2.5-flash",
    gradingModel: "gemini-2.5-flash",

    // Temperatures
    generationTemperature: 0.7,
    gradingTemperature: 0.2,

    // Buffer sizes
    buffers: {
        binary: { initial: 5, minimum: 2, replenish: 4 },
        multiple_choice: { initial: 5, minimum: 2, replenish: 4 },
        question_answer: { initial: 0, threshold: 6, minimum: 2, replenish: 4 },
    },

    // Thresholds
    qaGenerationMasteryThreshold: 0.3,

    // Cooldown
    cooldown: {
        initialDays: 14,
        multiplier: 1.5,
        maxRepeats: 3,
    },

    // Batch processing
    maxBatchSize: 10,
    maxRetries: 3,

    // Background job
    nightlyJobHour: 3, // 3 AM user's timezone
    predictionWindowDays: 7,
};
```
