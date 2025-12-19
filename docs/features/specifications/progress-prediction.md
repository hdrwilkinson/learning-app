# Progress Prediction & Visualization

<!--
Status: Draft
Created: 2025-11-30
Issue: #15
Owner: Harry
-->

> System specification for learning velocity prediction, progress tracking, and visual feedback.

## Related Specifications

| Spec                                                              | Relationship                                     |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| [Course Structure & Navigation](./course-structure-navigation.md) | Provides course/lesson structure for predictions |
| [Spaced Repetition Algorithm](./spaced-repetition-algorithm.md)   | Provides mastery data for progress calculations  |
| [Data Collection & Analytics](./data-collection-analytics.md)     | User learning profiles feed into predictions     |

## Overview

Users set either a **time commitment** or a **deadline**, and the system predicts the other. As users study, predictions become more accurate based on observed learning behavior.

### Core Principles

1. **Personalized predictions**: Each user's learning profile shapes estimates
2. **Transparent progress**: Users see where they are vs where they should be
3. **Motivational boundaries**: Show impact of studying more/less
4. **Decay awareness**: Show forgetting, but emphasize recovery and upward trends

---

## User Input

### Primary Metric: Time Per Week

```
┌─────────────────────────────────────────────────────────────────┐
│  How much time can you dedicate to this course?                 │
│                                                                 │
│  Hours per week: [____5____]                                    │
│                                                                 │
│  Which days will you typically study?                           │
│  [✓] Mon  [✓] Tue  [✓] Wed  [✓] Thu  [✓] Fri  [ ] Sat  [ ] Sun │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Alternative: Deadline-First

```
┌─────────────────────────────────────────────────────────────────┐
│  When do you need to complete this course?                      │
│                                                                 │
│  Target date: [March 15, 2026]                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📊 To hit this deadline, you'll need ~8 hours/week             │
│                                                                 │
│  [Adjust deadline]  [Accept & continue]                         │
└─────────────────────────────────────────────────────────────────┘
```

### Derived Values

From time-per-week, we calculate:

- Estimated completion date
- Weekly milestones (expected progress checkpoints)
- Buffer for catch-up if user falls behind

> **Schema Note:** User schedule preferences (days per week, minutes per session) are stored on the `CourseMembership` record, not the `Course` itself. This allows each user to have personalized study schedules for the same course. See [Database Schema Reference](/docs/reference/database-schema).

---

## User Learning Profile

Hidden variables that model individual learning characteristics. All start at 1.0 (baseline) and adjust based on observed behavior.

```typescript
interface UserLearningProfile {
    // === Core Metrics ===

    acquisitionRate: number;
    // How fast user grasps new concepts (IPs per hour of study)
    // Observed: Time spent in Learn mode vs IPs completed
    // Higher = faster learner

    retentionStrength: number;
    // How well user retains information over time
    // Observed: Performance on spaced repetition reviews
    // Higher = longer intervals before forgetting

    quizAccuracy: number;
    // How often user answers correctly across quiz types
    // Observed: Correct/total across all quizzes
    // Higher = more accurate

    recoverySpeed: number;
    // How quickly user re-masters forgotten content
    // Observed: Time to return to mastery after a lapse
    // Higher = bounces back faster

    sessionEfficiency: number;
    // Ratio of effective study time to clock time
    // Observed: Progress per session duration
    // Higher = more focused sessions

    // === Metadata ===

    dataPoints: number; // How many observations inform this profile
    confidence: number; // 0-1, how reliable these estimates are
    lastUpdated: Date;
}
```

### Profile Updates

Profiles update **weekly** based on observed behavior:

```typescript
function updateLearningProfile(
    profile: UserLearningProfile,
    weeklyStats: WeeklyLearningStats
): UserLearningProfile {
    const LEARNING_RATE = 0.1; // How fast profile adapts (tunable)

    // Example: Update acquisition rate
    const observedRate = weeklyStats.ipsIntroduced / weeklyStats.learnModeHours;
    const expectedRate = profile.acquisitionRate * BASELINE_IPS_PER_HOUR;
    const rateRatio = observedRate / expectedRate;

    profile.acquisitionRate =
        profile.acquisitionRate * (1 - LEARNING_RATE) +
        profile.acquisitionRate * rateRatio * LEARNING_RATE;

    profile.dataPoints++;
    profile.confidence = Math.min(1, profile.dataPoints / 20); // Max confidence after 20 weeks
    profile.lastUpdated = new Date();

    return profile;
}
```

### Future Expansion

As we gather more data, additional metrics may include:

- Subject-specific rates (math vs language vs coding)
- Time-of-day effectiveness
- Session length sweet spot
- Consistency factor (regular vs irregular study patterns)

---

## Course Sizing

### Base Calculation

```typescript
interface CourseSizeMetrics {
    totalIPs: number;
    avgComplexity: number; // Default 1.0, can be set per IP
    effectiveSize: number; // Computed
    estimatedHours: number; // For baseline user
}

function calculateCourseSize(course: Course): CourseSizeMetrics {
    const totalIPs = course.modules
        .flatMap((m) => m.lessons)
        .flatMap((l) => l.informationPoints).length;

    const avgComplexity =
        course.modules
            .flatMap((m) => m.lessons)
            .flatMap((l) => l.informationPoints)
            .reduce((sum, ip) => sum + (ip.complexity ?? 1.0), 0) / totalIPs;

    const baseSize = totalIPs * avgComplexity;

    // Scale factor: larger courses are disproportionately harder
    // More content = more interference, more to review while learning new
    const scaleFactor = Math.pow(baseSize / 100, 0.2);

    const effectiveSize = baseSize * scaleFactor;

    // Baseline estimate: ~3 IPs per hour for average user
    const estimatedHours = effectiveSize / BASELINE_IPS_PER_HOUR;

    return { totalIPs, avgComplexity, effectiveSize, estimatedHours };
}
```

### Scale Factor Reference

| Raw IPs | Scale Factor | Effective Size | Est. Hours (baseline) |
| ------- | ------------ | -------------- | --------------------- |
| 25      | 0.76         | 19             | 6                     |
| 50      | 0.87         | 44             | 15                    |
| 100     | 1.00         | 100            | 33                    |
| 200     | 1.15         | 230            | 77                    |
| 500     | 1.38         | 690            | 230                   |

---

## Prediction Formula

### Time to Completion

```typescript
function predictCompletionTime(
    course: Course,
    user: UserLearningProfile,
    hoursPerWeek: number
): CompletionPrediction {
    const courseSize = calculateCourseSize(course);

    // Personalized hours needed
    const personalizedHours =
        courseSize.estimatedHours /
        user.acquisitionRate /
        user.retentionStrength /
        user.sessionEfficiency;

    // Add buffer for review time (spaced repetition overhead)
    // Earlier in course: more review relative to new content
    // Later: reviews spread out, less overhead
    const reviewOverhead = 1.3; // 30% additional time for reviews (tunable)

    const totalHoursNeeded = personalizedHours * reviewOverhead;

    // Convert to weeks
    const weeksToComplete = totalHoursNeeded / hoursPerWeek;

    // Calculate milestones
    const milestones = generateWeeklyMilestones(course, weeksToComplete);

    return {
        totalHoursNeeded,
        weeksToComplete,
        estimatedCompletionDate: addWeeks(new Date(), weeksToComplete),
        confidence: user.confidence,
        milestones,
    };
}
```

### Inverse: Hours Needed for Deadline

```typescript
function predictRequiredHours(
    course: Course,
    user: UserLearningProfile,
    deadline: Date
): HoursPrediction {
    const courseSize = calculateCourseSize(course);
    const weeksAvailable = differenceInWeeks(deadline, new Date());

    const personalizedHours =
        courseSize.estimatedHours /
        user.acquisitionRate /
        user.retentionStrength /
        user.sessionEfficiency;

    const totalHoursNeeded = personalizedHours * 1.3; // Review overhead

    const hoursPerWeek = totalHoursNeeded / weeksAvailable;

    return {
        hoursPerWeek,
        totalHoursNeeded,
        feasibility: assessFeasibility(hoursPerWeek),
        confidence: user.confidence,
    };
}

function assessFeasibility(hoursPerWeek: number): Feasibility {
    if (hoursPerWeek <= 5) return "comfortable";
    if (hoursPerWeek <= 10) return "moderate";
    if (hoursPerWeek <= 20) return "intensive";
    return "unrealistic";
}
```

---

## Progress Visualization

### Course Level: The Learning Curve

**Axes:**

- **X-axis**: Toggleable between "Time Invested (hours)" and "Calendar Time (days)"
- **Y-axis**: Overall Mastery (0-100%)

**Elements:**

1. **Personalized prediction curve** (logarithmic shape, based on user profile)
2. **Two effort boundaries** (+50% effort, -50% effort)
3. **Actual progress line** (user's real data)
4. **Mastery threshold line** (80%)
5. **Current position marker**

```
Mastery %
     │
     │                                              ╭── +50% effort
100% │                                         ╭────┤
     │                                   ╭─────┤    │
     │                             ╭─────╯     │    │
 80% │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╭────╯─ ─ ─ ─ ─ ─│─ ─ │─  Mastery threshold
     │                 ╭────╯                 │    │
     │            ╭────╯      Predicted ──────┤    │
 60% │       ╭────╯           (your pace)     │    │
     │    ╭──╯                                ╰────┤
     │   ╱                                         ╰── -50% effort
 40% │  ╱      ━━━●
     │ ╱          ↑ You are here
     │╱           (ahead of pace!)
 20% │
     │
  0% │
     └────────────────────────────────────────────────────▶
     0         20         40         60         80       100
                      Time Invested (hours)

     [Toggle: Hours ↔ Days]
```

### Boundary Meaning

| Boundary            | Shows                                    |
| ------------------- | ---------------------------------------- |
| Upper (+50% effort) | "If you studied 50% more, you'd be here" |
| Predicted (center)  | "Your current pace leads here"           |
| Lower (-50% effort) | "If you slack off, you'd be here"        |

### Personalized Curve Shape

The curve is generated based on user's learning profile:

```typescript
function generatePredictionCurve(
    courseSize: CourseSizeMetrics,
    user: UserLearningProfile,
    maxHours: number
): Point[] {
    const points: Point[] = [];

    for (let hours = 0; hours <= maxHours; hours += maxHours / 100) {
        // Logarithmic growth toward 100%
        // Shape influenced by user's acquisition rate and retention
        const k = 0.05 * user.acquisitionRate * user.retentionStrength;
        const mastery =
            100 *
            (1 - Math.exp(((-k * hours) / courseSize.effectiveSize) * 100));

        points.push({ x: hours, y: Math.min(100, mastery) });
    }

    return points;
}
```

---

### Module & Lesson Level: Progress + Decay

Shows the "sawtooth" pattern of learning, forgetting, reviewing, strengthening—similar to Strava/Garmin fitness scores.

```
┌─────────────────────────────────────────────────────────────────┐
│  MODULE 2: Data Structures                                      │
│                                                                 │
│  Current: 67%   Trend: ↗ Improving                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 100%                                                        ││
│  │                                                             ││
│  │  80% ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╭╮─╭─╮─╭──────  ← Mastery zone   ││
│  │                      ╭────╯╰─╯ ╰─╯                          ││
│  │                 ╭────╯         ↑                            ││
│  │  60%       ╭────╯        Quick recovery                     ││
│  │       ╭────╯              after dip                         ││
│  │  40% ─╯                                                     ││
│  │                                                             ││
│  │  20%                                                        ││
│  │   ╱                                                         ││
│  │  0%──────────────────────────────────────────────────▶      ││
│  │     W1   W2   W3   W4   W5   W6   W7   W8                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  💡 Dips are normal! Each review makes your memory stronger.   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key messaging:**

- Normalize the dips ("Dips are normal!")
- Emphasize upward trend ("Each review makes memory stronger")
- Show quick recovery ("You bounced back in 2 days")

---

### Lesson Level: Compact View

```
┌─────────────────────────────────────────────────────────────────┐
│  Lesson 2.3: Binary Search Trees                                │
│                                                                 │
│  ████████████████████░░░░░░░░  73%   ↗ +5% this week           │
│                                                                 │
│  ▁▂▃▄▅▆▇█▇▆▇█  ← Mini sparkline (last 30 days)                 │
│                                                                 │
│  Next review: 3 days  •  8/10 IPs mastered                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### Information Point Level: Detail View Only

Shown when user drills into a specific IP:

```
┌─────────────────────────────────────────────────────────────────┐
│  BST Deletion (two children)                                    │
│                                                                 │
│  State: Learning (not yet mastered)                             │
│  Mastery: 62%   Baseline: 55%   Stability: 4 days              │
│                                                                 │
│  Last 10 reviews:                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ○───●───○───●───●───○───●───●───●───●                      ││
│  │  ✗   ✓   ✗   ✓   ✓   ✗   ✓   ✓   ✓   ✓                      ││
│  │  │                               │                          ││
│  │ 3 weeks ago                    Today                        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Trend: Improving steadily. 2 more correct → unlocks Q&A mode  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Weekly Updates & Alerts

### Automatic Recalculation

Every week, the system:

1. Updates user's learning profile based on past week's data
2. Recalculates completion prediction
3. Compares to previous prediction
4. Generates appropriate alert

### Alert Types

```typescript
type ProgressAlert =
    | { type: "on_track"; message: string }
    | { type: "ahead"; daysAhead: number; message: string }
    | {
          type: "behind";
          daysBehind: number;
          message: string;
          suggestion: string;
      }
    | {
          type: "prediction_updated";
          oldDate: Date;
          newDate: Date;
          reason: string;
      };
```

### Example Alerts

**On Track:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Weekly Update: You're on track!                             │
│                                                                 │
│  This week: 4.5 hours studied, 12 IPs mastered                 │
│  Estimated completion: March 15 (unchanged)                     │
│                                                                 │
│  Keep it up! 🎯                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Ahead:**

```
┌─────────────────────────────────────────────────────────────────┐
│  🚀 Weekly Update: You're ahead of schedule!                    │
│                                                                 │
│  This week: 7 hours studied (vs 5 planned)                     │
│  You're now 8 days ahead of schedule                           │
│                                                                 │
│  New estimate: March 7 (was March 15)                          │
│                                                                 │
│  Amazing progress! 🌟                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Behind:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Weekly Update: You've fallen a bit behind                   │
│                                                                 │
│  This week: 2 hours studied (vs 5 planned)                     │
│  You're now 5 days behind schedule                             │
│                                                                 │
│  To catch up: Add 1 extra hour next week                       │
│  Or: Adjust deadline to March 20                               │
│                                                                 │
│  [Adjust Schedule]  [I'll catch up]                            │
└─────────────────────────────────────────────────────────────────┘
```

**Prediction Updated:**

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Your estimate has been refined                              │
│                                                                 │
│  Based on your learning pace over the past 4 weeks,            │
│  we've updated your completion estimate:                        │
│                                                                 │
│  Old estimate: March 15                                         │
│  New estimate: March 8                                          │
│                                                                 │
│  You're learning faster than initially predicted! 📈            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Course Progress Summary

```typescript
interface CourseProgressSummary {
    courseId: string;
    userId: string;

    // Time tracking
    totalHoursStudied: number;
    hoursThisWeek: number;
    targetHoursPerWeek: number;

    // Progress
    overallMastery: number; // 0-100
    ipsIntroduced: number;
    ipsMastered: number;
    totalIPs: number;

    // Prediction
    predictedCompletionDate: Date;
    originalTargetDate: Date | null;
    daysAheadOrBehind: number; // Positive = ahead

    // Trend
    masteryTrend: "improving" | "stable" | "declining";
    weeklyMasteryChange: number; // Percentage points

    // History (for graphs)
    weeklySnapshots: WeeklySnapshot[];
}

interface WeeklySnapshot {
    weekNumber: number;
    date: Date;
    hoursStudied: number;
    masteryLevel: number;
    ipsIntroduced: number;
    ipsMastered: number;
    predictedCompletion: Date;
}
```

---

## Constants & Configuration

```typescript
const PROGRESS_CONFIG = {
    // Course sizing
    BASELINE_IPS_PER_HOUR: 3,
    SCALE_FACTOR_EXPONENT: 0.2,
    REVIEW_OVERHEAD_MULTIPLIER: 1.3,

    // Learning profile
    PROFILE_LEARNING_RATE: 0.1, // How fast profile adapts
    PROFILE_CONFIDENCE_THRESHOLD: 20, // Weeks to max confidence

    // Effort boundaries
    UPPER_BOUNDARY_MULTIPLIER: 1.5, // +50% effort
    LOWER_BOUNDARY_MULTIPLIER: 0.5, // -50% effort

    // Alerts
    ALERT_THRESHOLD_DAYS_BEHIND: 3, // When to warn about falling behind
    RECALCULATION_DAY: "sunday", // Weekly recalc day

    // Graph settings
    DEFAULT_X_AXIS: "hours", // 'hours' | 'days'
    SPARKLINE_DAYS: 30,
    DETAIL_HISTORY_POINTS: 10,
};
```

---

## Future Considerations

1. **Adaptive scheduling**: Suggest optimal study times based on observed patterns
2. **Peer comparison**: "Users like you typically complete in X weeks" (opt-in)
3. **Streak tracking**: Consecutive days/weeks on track
4. **Goal adjustments**: Easy UI to shift deadline or hours mid-course
5. **Multi-course balancing**: If user has multiple active courses, help prioritize
6. **Notification timing**: Learn when user is most likely to engage with alerts
