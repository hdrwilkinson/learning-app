# Data Collection & Analytics

<!--
Status: Draft
Created: 2025-11-30
Issue: #15
Owner: Harry
-->

> Specification for comprehensive data collection to enable ML models, personalization, and content improvement.

## Related Specifications

| Spec                                                            | Relationship                                |
| --------------------------------------------------------------- | ------------------------------------------- |
| [Spaced Repetition Algorithm](./spaced-repetition-algorithm.md) | Source of quiz response data                |
| [Question Generation](./question-generation.md)                 | Provides data for question quality analysis |
| [Progress Prediction](./progress-prediction.md)                 | User profiles inform prediction models      |

## Overview

Collect comprehensive behavioral and contextual data to:

1. Build better predictive models (forgetting curves, difficulty estimation)
2. Personalize learning pathways
3. Enable A/B testing of different approaches
4. Understand user behavior patterns

### Privacy Principles

- **Comprehensive but transparent**: Collect rich data, but clearly disclose
- **GDPR compliant**: Full data export, right to deletion, clear consent
- **User control**: Users can adjust privacy settings
- **No user-facing analytics initially**: Keep the experience simple

---

## Data Models

### 1. Quiz Response (Most Granular)

Every quiz interaction captured in detail.

```typescript
interface QuizResponse {
    // === Identity ===
    id: string;
    userId: string;
    sessionId: string;
    informationPointId: string;
    lessonId: string;
    moduleId: string;
    courseId: string;

    // === Quiz Context ===
    quizTypeId: string;
    questionId: string | null; // If pre-generated question
    questionVariant: string | null; // For A/B testing question formats
    wasAIGenerated: boolean; // Dynamic vs pre-made

    // === Response ===
    isCorrect: boolean;
    userAnswer: string | null; // Actual user response (Q&A)
    selectedOptionIndex: number | null; // For MC (0-3)
    correctAnswer: string;
    confidenceRating: number | null; // Self-reported 1-5 (if enabled)

    // === Timing ===
    responseTimeMs: number; // Question shown → answer submitted
    timeToFirstInteractionMs: number; // Before typing/clicking

    // === State Snapshot (pre-response) ===
    masteryBefore: number;
    baselineBefore: number;
    stabilityBefore: number;
    daysSinceLastReview: number | null;
    reviewNumber: number; // 1st, 2nd, 3rd review of this IP
    currentStreak: number;

    // === Session Context ===
    positionInSession: number; // 1st, 5th, 20th question
    sessionDurationAtResponseMs: number;
    questionsAnsweredInSession: number;
    correctInSessionSoFar: number;
    wasInterleaved: boolean; // Mixed with other IPs?
    previousIPId: string | null; // What was tested before this

    // === Help & Hints ===
    hintRequested: boolean;
    hintType: string | null;
    hintCount: number; // How many hints used
    enteredLearnMode: boolean; // Clicked "explain this"
    learnModeDurationMs: number | null;

    // === A/B Testing ===
    experimentIds: string[]; // Active experiments
    variantIds: string[]; // Assigned variants

    // === Context ===
    context: ContextualData;

    createdAt: Date;
}
```

### 2. Study Session

Each study session as a unit.

```typescript
interface StudySession {
    // === Identity ===
    id: string;
    userId: string;
    courseId: string;

    // === Timing ===
    startedAt: Date;
    endedAt: Date | null;
    totalDurationMs: number;
    activeDurationMs: number; // Excluding idle (>30s gaps)

    // === Session Type ===
    sessionType:
        | "daily_queue"
        | "lesson_focus"
        | "review_only"
        | "skip_quiz"
        | "curiosity"
        | "learn_only";
    entryPoint:
        | "notification"
        | "home"
        | "course_page"
        | "deep_link"
        | "widget";
    targetLessonId: string | null; // If lesson-focused

    // === Content Coverage ===
    ipsIntroduced: number; // New IPs (Learn mode)
    ipsReviewed: number; // Existing IPs (Quiz mode)
    uniqueIPsTouched: number;
    lessonsWorkedOn: string[];
    modulesWorkedOn: string[];

    // === Performance ===
    totalQuestions: number;
    correctAnswers: number;
    accuracyRate: number;
    averageResponseTimeMs: number;
    medianResponseTimeMs: number;
    fastestResponseMs: number;
    slowestResponseMs: number;

    // === Engagement ===
    questionsSkipped: number;
    learnModeEntrances: number;
    totalLearnModeTimeMs: number;
    hintsUsed: number;

    // === Idle & Interruptions ===
    pauseEvents: PauseEvent[];
    totalIdleTimeMs: number;
    longestIdleMs: number;

    // === Outcomes ===
    masteryGainTotal: number;
    ipsMovedToMastered: number;
    ipsLapsed: number;
    newIPsUnlocked: number;

    // === Completion ===
    wasCompleted: boolean;
    queueCompletionRate: number; // % of planned queue finished
    exitReason:
        | "completed"
        | "manual_quit"
        | "timeout"
        | "backgrounded"
        | "error"
        | null;
    exitPosition: number | null; // Question # when they quit

    // === Context ===
    context: ContextualData;

    // === A/B Testing ===
    experimentIds: string[];
    variantIds: string[];

    createdAt: Date;
}

interface PauseEvent {
    startedAt: Date;
    durationMs: number;
    reason: "idle" | "backgrounded" | "notification" | "unknown";
}
```

### 3. Learn Mode Event

Non-quiz learning interactions.

```typescript
interface LearnModeEvent {
    id: string;
    userId: string;
    sessionId: string;
    informationPointId: string;
    courseId: string;

    // === Trigger ===
    trigger: "first_introduction" | "quiz_help" | "manual_review" | "curiosity";

    // === Engagement ===
    durationMs: number;
    scrollDepth: number; // 0-100%
    contentSectionsViewed: string[];
    examplesExpanded: number;

    // === Interaction (if chat-based) ===
    chatMessagesCount: number;
    userQuestions: string[]; // What they asked
    aiResponsesCount: number;

    // === Media Engagement ===
    imagesViewed: number;
    videosStarted: number;
    videosCompleted: number;
    codeBlocksCopied: number;

    // === Outcome ===
    markedAsUnderstood: boolean;
    confidenceAfter: number | null; // 1-5 if captured
    immediateQuizResult: boolean | null; // If followed by quiz

    // === Context ===
    context: ContextualData;

    createdAt: Date;
}
```

### 4. Contextual Data

Captured with every event.

```typescript
interface ContextualData {
    // === Device ===
    deviceType: "mobile" | "tablet" | "desktop";
    deviceModel: string | null; // 'iPhone 14', 'Galaxy S23', etc.
    screenWidth: number;
    screenHeight: number;
    osType: string; // 'iOS', 'Android', 'Windows', 'macOS'
    osVersion: string;
    appVersion: string;
    browserName: string | null; // If web
    browserVersion: string | null;

    // === Time ===
    localTimestamp: Date;
    utcTimestamp: Date;
    timezone: string; // 'Europe/London'
    utcOffset: number; // Minutes from UTC
    hourOfDay: number; // 0-23 local time
    dayOfWeek: number; // 0-6 (Sunday = 0)
    isWeekend: boolean;

    // === Network ===
    connectionType: "wifi" | "4g" | "5g" | "3g" | "offline" | "unknown";
    connectionEffectiveType: string | null;

    // === Location (with consent) ===
    country: string | null;
    region: string | null; // State/province
    city: string | null;
    locationType: "home" | "work" | "school" | "commute" | "other" | null; // User-tagged

    // === Environment (with consent) ===
    ambientLightLevel: "dark" | "dim" | "normal" | "bright" | null;
    isLowPowerMode: boolean | null;
    batteryLevel: number | null; // 0-100
    isCharging: boolean | null;
}
```

### 5. User Behavior Profile

Aggregated from events, updated weekly.

```typescript
interface UserBehaviorProfile {
    userId: string;

    // === Study Patterns ===
    totalSessionsAllTime: number;
    averageSessionsPerWeek: number;
    averageSessionDurationMs: number;
    medianSessionDurationMs: number;

    // === Time Preferences ===
    preferredHoursOfDay: HourWeight[]; // [{hour: 9, weight: 0.3}, ...]
    preferredDaysOfWeek: DayWeight[];
    averageTimeBetweenSessions: number; // Hours
    consistencyScore: number; // 0-1, regularity of study

    // === Location Patterns ===
    locationPerformance: LocationPerformance[];
    bestPerformingLocation: string | null;

    // === Learning Style Indicators ===
    learnModeUsageRate: number; // % of IPs where they use learn mode
    averageLearnModeDurationMs: number;
    hintUsageRate: number;
    prefersDeepDive: boolean; // Long sessions, fewer IPs
    prefersQuickHits: boolean; // Short sessions, more IPs

    // === Performance Patterns ===
    overallAccuracyRate: number;
    accuracyByQuizType: Record<string, number>;
    accuracyByHourOfDay: Record<number, number>;
    accuracyByDayOfWeek: Record<number, number>;
    accuracyByLocation: Record<string, number>;
    sessionFatigueCurve: number[]; // Accuracy at position 1, 5, 10, 20...
    fatigueOnsetPosition: number | null;
    optimalSessionLength: number | null; // Minutes before fatigue

    // === Retention Patterns ===
    averageRetentionDays: number;
    retentionByQuizType: Record<string, number>;
    lapseRecoveryDays: number; // Average days to re-master

    // === Response Timing ===
    averageResponseTimeMs: number;
    responseTimeByQuizType: Record<string, number>;
    responseTimeByAccuracy: { correct: number; incorrect: number };

    // === Engagement ===
    currentStreakDays: number;
    longestStreakDays: number;
    totalStudyHoursAllTime: number;
    studyHoursLast30Days: number;
    lastActiveAt: Date;
    daysActiveLastMonth: number;

    // === Risk Indicators ===
    churnRiskScore: number; // 0-1, likelihood of dropping off

    updatedAt: Date;
}

interface HourWeight {
    hour: number; // 0-23
    sessionCount: number;
    averageAccuracy: number;
    weight: number; // Normalized preference
}

interface LocationPerformance {
    locationType: string;
    sessionCount: number;
    averageAccuracy: number;
    averageSessionDuration: number;
}
```

### 6. Content Analytics

How content performs across all users.

```typescript
interface InformationPointAnalytics {
    informationPointId: string;
    lessonId: string;
    courseId: string;

    // === Sample Size ===
    totalAttempts: number;
    uniqueUsers: number;

    // === Difficulty ===
    globalAccuracyRate: number;
    globalDifficultyScore: number; // 0-1, derived from accuracy
    averageAttemptsToMaster: number;
    medianAttemptsToMaster: number;
    averageTimeToMasterHours: number;

    // === By Quiz Type ===
    performanceByQuizType: QuizTypePerformance[];

    // === Common Errors ===
    commonWrongAnswers: WrongAnswerPattern[];
    confusedWithIPs: string[]; // IPs users mix this up with

    // === Retention ===
    averageRetentionDays: number;
    lapseRate: number; // % who forget after mastering
    lapseRecoveryRate: number; // % who re-master after lapse

    // === Learning Mode ===
    learnModeEngagementRate: number;
    averageLearnModeDuration: number;
    learnModeEffectiveness: number; // Correlation with subsequent success

    // === Sequencing Insights ===
    prerequisiteCorrelations: PrerequisiteCorrelation[];

    updatedAt: Date;
}

interface QuizTypePerformance {
    quizTypeId: string;
    attempts: number;
    accuracyRate: number;
    averageResponseTimeMs: number;
}

interface WrongAnswerPattern {
    answer: string;
    frequency: number; // % of wrong answers
    possibleMisconception: string | null;
}

interface PrerequisiteCorrelation {
    prerequisiteIPId: string;
    correlationStrength: number; // -1 to 1
    // Positive = mastering prereq helps this IP
}
```

### 7. Lesson & Module Analytics

Aggregated content performance.

```typescript
interface LessonAnalytics {
    lessonId: string;
    moduleId: string;
    courseId: string;

    // === Completion ===
    startedCount: number;
    completedCount: number;
    completionRate: number;
    averageTimeToCompleteHours: number;

    // === Performance ===
    overallAccuracyRate: number;
    difficultIPIds: string[]; // Bottom 20% by accuracy

    // === Drop-off Analysis ===
    dropOffPoints: DropOffPoint[];

    // === Sequencing ===
    currentIPOrder: string[];
    suggestedIPOrder: string[] | null; // If analysis suggests reorder

    updatedAt: Date;
}

interface DropOffPoint {
    afterIPId: string;
    dropOffRate: number; // % who quit after this IP
    averageMasteryAtDropOff: number;
}
```

---

## A/B Testing Infrastructure

### Experiment Definition

```typescript
interface Experiment {
    id: string;
    name: string;
    description: string;

    // === Scope ===
    targetEntity: "user" | "session" | "course" | "lesson" | "ip";
    targetFilter: ExperimentFilter | null; // e.g., only new users

    // === Variants ===
    variants: ExperimentVariant[];

    // === Status ===
    status: "draft" | "running" | "paused" | "completed";
    startedAt: Date | null;
    endedAt: Date | null;

    // === Metrics ===
    primaryMetric: string; // e.g., 'accuracy_rate', 'retention_days'
    secondaryMetrics: string[];
    minimumSampleSize: number;

    createdAt: Date;
}

interface ExperimentVariant {
    id: string;
    name: string; // 'control', 'treatment_a', etc.
    weight: number; // Traffic allocation (0-1)
    config: Record<string, any>; // Variant-specific settings
}

interface ExperimentAssignment {
    experimentId: string;
    variantId: string;
    userId: string;
    assignedAt: Date;
}
```

### Example Experiments

| Experiment              | Variants                           | Primary Metric     |
| ----------------------- | ---------------------------------- | ------------------ |
| Interleaving ratio      | 50% interleaved vs 80% interleaved | 7-day retention    |
| Quiz type progression   | Fast unlock vs gradual unlock      | Mastery rate       |
| Session length nudge    | No nudge vs 15min vs 20min         | Completion rate    |
| Hint availability       | Always vs unlock at streak         | Long-term accuracy |
| Review interval formula | SM-2 vs FSRS-inspired              | Lapse rate         |

---

## Data Retention Policy

### Retention Periods

| Data Type                   | Retention             | Rationale                        |
| --------------------------- | --------------------- | -------------------------------- |
| Quiz responses (full)       | 2 years               | ML training, detailed analysis   |
| Quiz responses (aggregated) | Indefinitely          | Long-term insights               |
| Session data (full)         | 2 years               | Behavior pattern analysis        |
| Session data (aggregated)   | Indefinitely          | Product metrics                  |
| Learn mode events           | 1 year                | Content effectiveness            |
| User behavior profile       | Until account deleted | Active personalization           |
| Content analytics           | Indefinitely          | Course improvement               |
| Contextual data             | 1 year                | Context-specific models          |
| Experiment data             | 3 years               | Reference for future experiments |

### Aggregation Schedule

```typescript
const AGGREGATION_SCHEDULE = {
    // Daily
    daily: ["session_summaries", "content_accuracy_updates"],

    // Weekly
    weekly: [
        "user_behavior_profiles",
        "content_analytics",
        "experiment_metrics",
    ],

    // Monthly
    monthly: ["historical_trend_snapshots"],

    // After retention period
    cleanup: ["compress_old_responses", "delete_expired_contextual"],
};
```

---

## GDPR Compliance

### Data Subject Rights

```typescript
interface GDPRCapabilities {
    // Right to access
    exportUserData(userId: string): Promise<UserDataExport>;

    // Right to be forgotten
    deleteUserData(userId: string): Promise<DeletionConfirmation>;

    // Right to rectification
    updateUserData(
        userId: string,
        corrections: DataCorrection[]
    ): Promise<void>;

    // Right to data portability
    exportPortableFormat(userId: string): Promise<PortableDataPackage>;
}

interface UserDataExport {
    // All data associated with user
    profile: UserProfile;
    behaviorProfile: UserBehaviorProfile;
    courseProgress: CourseProgressSummary[];
    sessions: StudySession[];
    responses: QuizResponse[];
    learnEvents: LearnModeEvent[];

    exportedAt: Date;
    format: "json";
}
```

### Consent Management

```typescript
interface UserConsent {
    userId: string;

    // Required for core functionality
    coreDataCollection: true; // Always required

    // Optional enhanced collection
    locationTracking: boolean;
    deviceDetails: boolean;
    ambientContext: boolean; // Light level, battery, etc.

    // Analytics participation
    anonymizedAnalytics: boolean;
    experimentParticipation: boolean;

    updatedAt: Date;
    consentVersion: string;
}
```

### Privacy UI Requirements

1. **At signup**: Clear explanation of data collection, consent toggles
2. **In settings**: Ability to modify consent, view/export/delete data
3. **In-app**: Privacy policy link, data usage transparency

---

## Real-time vs Batch Processing

### Real-time (Immediate)

| Data                  | Processing                                |
| --------------------- | ----------------------------------------- |
| Quiz response         | Update user mastery, schedule next review |
| Session end           | Calculate session stats, update streak    |
| Milestone reached     | Trigger notification/celebration          |
| Experiment assignment | Assign on first relevant event            |

### Near Real-time (Minutes)

| Data                     | Processing                |
| ------------------------ | ------------------------- |
| Content accuracy updates | Aggregate every 5 minutes |
| Active user counts       | Dashboard refresh         |

### Batch (Scheduled)

| Data                     | Schedule           | Processing                      |
| ------------------------ | ------------------ | ------------------------------- |
| User behavior profiles   | Weekly (Sunday)    | Full recalculation              |
| Content analytics        | Weekly             | Aggregate all metrics           |
| Prediction model updates | Weekly             | Retrain/update coefficients     |
| Data cleanup             | Monthly            | Archive/delete old data         |
| Experiment analysis      | On-demand + weekly | Statistical significance checks |

---

## Future ML Model Opportunities

### Models to Build

| Model                             | Training Data                     | Predicts              | Business Value         |
| --------------------------------- | --------------------------------- | --------------------- | ---------------------- |
| **Personalized forgetting curve** | Response history + intervals      | Optimal review timing | Better retention       |
| **Difficulty estimator**          | Global accuracy + response times  | IP difficulty rating  | Fairer progression     |
| **Fatigue detector**              | Session position + accuracy trend | When to suggest break | Better UX              |
| **Churn predictor**               | Engagement patterns + accuracy    | Users at risk         | Retention intervention |
| **Optimal sequencing**            | Prerequisite correlations         | Best IP order         | Faster mastery         |
| **Learning style classifier**     | Behavior patterns                 | User type             | Personalization        |
| **Time-to-mastery predictor**     | User profile + course size        | Completion estimates  | Realistic expectations |
| **Best study time**               | Time + location + accuracy        | When to nudge         | Smart notifications    |

### Data Requirements per Model

Each model requires minimum data before reliable:

| Model                | Min Users    | Min Data Points | Confidence Threshold |
| -------------------- | ------------ | --------------- | -------------------- |
| Forgetting curve     | 1 (personal) | 50 responses    | After 2 weeks        |
| Difficulty estimator | 20           | 100 attempts/IP | After 100 users      |
| Fatigue detector     | 100          | 1000 sessions   | After 3 months       |
| Churn predictor      | 500          | 10000 sessions  | After 6 months       |

---

## Implementation Priority

### Phase 1 (MVP)

- Quiz response logging (core fields)
- Session tracking (basic)
- User progress state

### Phase 2 (Post-launch)

- Full contextual data
- Content analytics
- A/B testing infrastructure

### Phase 3 (Scale)

- ML model training pipeline
- Advanced behavior profiling
- Predictive features
