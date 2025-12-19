# User Model

<!--
Status: Draft
Created: 2025-12-16
Issue: #15 (Q11, Q13)
Owner: Harry
-->

> System specification for user accounts, roles, relationships, and permissions.

## Related Specifications

| Spec                                                          | Relationship           |
| ------------------------------------------------------------- | ---------------------- |
| [Course Creation](./course-creation.md)                       | Users create courses   |
| [Progress Prediction](./progress-prediction.md)               | User learning profiles |
| [Data Collection & Analytics](./data-collection-analytics.md) | User behavior tracking |

## Overview

All users are equal at the global level - anyone can create courses and learn from courses. Roles only differ **per-course**, where users can be creators, admins, group leaders, or students.

### Core Principles

1. **Global equality**: All users have the same capabilities
2. **Per-course roles**: Permissions determined by relationship to specific course
3. **Multiple roles**: Users can hold multiple roles on the same course
4. **Social connections**: Users can follow each other

---

## Global User Model

Every user has the same base capabilities:

```typescript
interface User {
    id: string;

    // Identity
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;

    // Social
    followingIds: string[]; // Users this user follows
    followerIds: string[]; // Users following this user (computed)

    // Privacy settings
    privacySettings: UserPrivacySettings;

    // Learning profile (for progress predictions)
    learningProfile: UserLearningProfile;
}

interface UserPrivacySettings {
    // Course-related privacy
    showInStudentLists: boolean; // Appear in course student lists
    showProgressToGroupLeader: boolean; // Group leaders can see progress

    // Profile privacy
    profileVisibility: "public" | "private";
    showCoursesOnProfile: boolean; // Show enrolled/created courses
}
```

### Global Capabilities

| Capability              | All Users |
| ----------------------- | --------- |
| Create courses          | ✅ Yes    |
| Enroll in courses       | ✅ Yes    |
| Follow other users      | ✅ Yes    |
| Have a profile          | ✅ Yes    |
| Set privacy preferences | ✅ Yes    |

---

## Per-Course Roles

Users have roles specific to each course they're involved with.

### Role Definitions

**Course Roles** (one per user per course):

| Role        | Description             | How Assigned          |
| ----------- | ----------------------- | --------------------- |
| **CREATOR** | Made the course         | Automatic on creation |
| **ADMIN**   | Helps manage the course | Assigned by Creator   |
| **STUDENT** | Learning the course     | Enrolls or is invited |

**Group Roles** (one per user per group, independent of course role):

| Role       | Description                   | How Assigned                 |
| ---------- | ----------------------------- | ---------------------------- |
| **LEADER** | Manages a group within course | Assigned by Creator/Admin    |
| **MEMBER** | Regular group member          | Joins or is invited to group |

### Course Role Permissions

| Permission             | CREATOR | ADMIN | STUDENT |
| ---------------------- | ------- | ----- | ------- |
| Delete course          | ✅      | ❌    | ❌      |
| Edit course content    | ✅      | ✅    | ❌      |
| Manage course settings | ✅      | ✅    | ❌      |
| Assign Admins          | ✅      | ❌    | ❌      |
| Create groups          | ✅      | ✅    | ❌      |
| Manage all groups      | ✅      | ✅    | ❌      |
| Access course content  | ✅      | ✅    | ✅      |
| Complete quizzes       | ✅      | ✅    | ✅      |
| Track own progress     | ✅      | ✅    | ✅      |

### Group Role Permissions

| Permission                         | LEADER | MEMBER                 |
| ---------------------------------- | ------ | ---------------------- |
| View group progress                | ✅     | ❌                     |
| Invite to group (if policy allows) | ✅     | Depends on join policy |
| Lead discussions                   | ✅     | ❌                     |

### Role Rules

1. **Single course role**: A user has exactly one course role (CREATOR, ADMIN, or STUDENT)
2. **Separate group role**: Group roles (LEADER, MEMBER) are independent of course roles
3. **Creator is the owner**: CREATOR has all ADMIN permissions plus course deletion
4. **Combined access**: A STUDENT in a course can also be a LEADER in their group

---

## Course Membership

Course membership connects users to courses with a **single course-level role**. Group membership is managed separately via `GroupMembership`.

```typescript
interface CourseMembership {
    id: string;
    userId: string;
    courseId: string;
    courseRole: CourseRole; // Single role per course

    // User-specific learning preferences (for this course)
    learningGoal?: string; // User's objective for this course
    schedule?: Schedule; // User's study schedule

    joinedAt: Date;
}

type CourseRole = "CREATOR" | "ADMIN" | "STUDENT";

interface Schedule {
    daysPerWeek: DayOfWeek[];
    minutesPerSession: number; // 5-120
}

type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
```

> **Note:** Progress is tracked separately via `InformationPointProgress` records linked to each user. See [Database Schema Reference](/docs/reference/database-schema) for details.

---

## Groups (Cohorts)

Groups are **optional** subsets of users within a course. Group membership is managed separately from course membership via `GroupMembership`.

### Use Cases

- **Classroom**: Teacher creates a group for their class within a public course
- **Study group**: Students form a group to learn together
- **Cohort**: Organization enrolls employees in batches

### Group Data Model

```typescript
interface CourseGroup {
    id: string;
    courseId: string;
    name: string; // e.g., "Period 3 - Biology"
    isDefault: boolean; // Default group for the course
    joinPolicy: GroupJoinPolicy;
    createdAt: Date;
}

type GroupJoinPolicy =
    | "OPEN" // Anyone in the course can join
    | "MEMBER_INVITE" // Any group member can invite others
    | "LEADER_ONLY" // Only group leaders can invite
    | "INVITE_ONLY"; // Only course admins/creators can add members

interface GroupMembership {
    id: string;
    userId: string;
    groupId: string;
    groupRole: GroupRole;
    joinedAt: Date;
}

type GroupRole = "LEADER" | "MEMBER";
```

### Group Rules

1. **Groups are optional**: Courses can exist without any groups (each course has a default group)
2. **One group per user per course**: A user can only be in one group per course
3. **Separate from course role**: Group role (LEADER/MEMBER) is independent of course role (CREATOR/ADMIN/STUDENT)
4. **Leaders can be students**: A STUDENT in the course can be a LEADER in their group

---

## Course Sharing & Invitations

How users join private courses (public courses allow open enrollment).

### Invitation Methods

| Method          | Description                                  | Use Case                                      |
| --------------- | -------------------------------------------- | --------------------------------------------- |
| **By username** | Search and invite existing users             | Inviting known users                          |
| **By email**    | Send invite to email address                 | Inviting people who may not have accounts yet |
| **Invite code** | Shareable code (course-level or group-level) | Classrooms, cohorts, easy distribution        |

### Invite by Username

```
┌─────────────────────────────────────────────────────────────────┐
│  Invite to "Python for Data Science"                            │
│                                                                 │
│  Search users: [@john_______________] 🔍                        │
│                                                                 │
│  Found: @john_doe (John Doe)                                    │
│                                                                 │
│  Invite as: ○ Student  ○ Group Leader  ○ Admin                  │
│                                                                 │
│  [Send Invite]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Invite by Email

```
┌─────────────────────────────────────────────────────────────────┐
│  Invite by email                                                │
│                                                                 │
│  Email: [john@example.com_____________]                         │
│                                                                 │
│  Invite as: ○ Student  ○ Group Leader  ○ Admin                  │
│                                                                 │
│  [Send Invite]                                                  │
│                                                                 │
│  ℹ️ If they don't have an account, they'll be invited to sign up │
└─────────────────────────────────────────────────────────────────┘
```

### Invite Codes

Codes can be created at **course level** or **group level**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Course Invite Code                                             │
│                                                                 │
│  Code: PYTHON-2025-XYZ                                          │
│  Joins as: Student (ungrouped)                                  │
│                                                                 │
│  Share: learn.app/join/PYTHON-2025-XYZ                          │
│                                                                 │
│  [Copy]  [Regenerate]  [Disable]                                │
├─────────────────────────────────────────────────────────────────┤
│  Group Invite Code: "Mr. Smith's Class"                         │
│                                                                 │
│  Code: CALC-SMITH-ABC                                           │
│  Joins as: Student in "Mr. Smith's Class" group                 │
│                                                                 │
│  Share: learn.app/join/CALC-SMITH-ABC                           │
│                                                                 │
│  [Copy]  [Regenerate]  [Disable]                                │
└─────────────────────────────────────────────────────────────────┘
```

### Invitation Data Model

```typescript
interface CourseInvitation {
    id: string;
    courseId: string;

    // Who sent it
    invitedById: string;

    // Who it's for (one of these)
    invitedUserId?: string; // If inviting existing user by username
    invitedEmail?: string; // If inviting by email

    // What role they'll get
    role: "student" | "group_leader" | "admin";
    groupId?: string; // If inviting to specific group

    // Status
    status: "pending" | "accepted" | "declined" | "expired";

    // Timestamps
    createdAt: Date;
    expiresAt: Date; // Default: 7 days
    respondedAt?: Date;
}

interface InviteCode {
    id: string;
    code: string; // e.g., "PYTHON-2025-XYZ"

    // Scope (one of these)
    courseId?: string; // Course-level code
    groupId?: string; // Group-level code

    // What joiners get
    role: "student"; // Codes only grant student role

    // Limits
    maxUses?: number; // Optional cap
    usedCount: number;

    // Status
    isActive: boolean;
    expiresAt?: Date;

    // Metadata
    createdAt: Date;
    createdById: string;
}
```

### Member Removal

Creators and Admins can remove members from courses.

**What happens when removed:**

- ✅ Membership is deleted
- ✅ **Progress is deleted** (quiz answers, mastery scores, etc.)
- ✅ Pending invitations are revoked
- ❌ Cannot rejoin unless re-invited (for private courses)

```
┌─────────────────────────────────────────────────────────────────┐
│  Remove Member                                                  │
│                                                                 │
│  Are you sure you want to remove John Doe from this course?     │
│                                                                 │
│  ⚠️ This will permanently delete their progress.                 │
│                                                                 │
│  [Cancel]  [Remove Member]                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Who Can Manage Members

| Action                    | Creator | Admin | Group Leader   |
| ------------------------- | ------- | ----- | -------------- |
| Invite to course          | ✅      | ✅    | ❌             |
| Invite to own group       | ✅      | ✅    | ✅             |
| Create course invite code | ✅      | ✅    | ❌             |
| Create group invite code  | ✅      | ✅    | ✅ (own group) |
| Remove any member         | ✅      | ✅    | ❌             |
| Remove from own group     | ✅      | ✅    | ✅             |
| Change member roles       | ✅      | ✅    | ❌             |

---

## Following System

Users can follow other users to discover their public courses.

### Data Model

```typescript
interface Follow {
    id: string;
    followerId: string; // User doing the following
    followingId: string; // User being followed
    createdAt: Date;
}
```

### What Following Provides (MVP)

| Feature                                | Included    |
| -------------------------------------- | ----------- |
| See followed users' public courses     | ✅ Yes      |
| Followed users appear in a list        | ✅ Yes      |
| Activity feed from followed users      | ❌ Post-MVP |
| Notifications when they create courses | ❌ Post-MVP |

### Following Visibility

- Following list: **Private** by default (only you see who you follow)
- Follower count: **Public** (others can see how many follow you)
- Follower list: **Configurable** in privacy settings

---

## Example Scenarios

### Scenario 1: Simple Personal Course

```
Course: "My Python Notes"
Visibility: Private

├── Creator: Alice
│   └── Roles: [creator, admin, student]
│   └── (Learning her own course as she builds it)
│
└── No other members (personal use)
```

### Scenario 2: Public Course with Individual Learners

```
Course: "Introduction to Machine Learning"
Visibility: Public

├── Creator: DataSciencePro
│   └── Roles: [creator, admin]
│
├── Admins:
│   └── Assistant1 - Roles: [admin]
│
└── Students: 2,000 individual learners
    └── No groups - everyone learns independently
```

### Scenario 3: Course with Classroom Groups

```
Course: "AP Calculus BC"
Visibility: Public

├── Creator: TextbookPublisher
│   └── Roles: [creator, admin]
│
├── Group: "Lincoln High - Mr. Smith"
│   ├── Leader: Mr. Smith
│   │   └── Roles: [group_leader, student]
│   │   └── (Also learning alongside his students)
│   └── Students: 30 students
│
├── Group: "Jefferson Academy - Ms. Jones"
│   ├── Leader: Ms. Jones
│   │   └── Roles: [group_leader]
│   └── Students: 28 students
│
└── Ungrouped Students: 500 individual learners
```

### Scenario 4: Private Shared Course

```
Course: "Company Onboarding"
Visibility: Private

├── Creator: HR_Admin
│   └── Roles: [creator, admin]
│
├── Group: "2025 Q1 Cohort"
│   ├── Leader: TeamLead_Sarah
│   │   └── Roles: [group_leader]
│   └── Students: 15 new employees
│
└── Group: "2025 Q2 Cohort"
    ├── Leader: TeamLead_Mike
    │   └── Roles: [group_leader]
    └── Students: 12 new employees
```

---

## User Profile

What's visible on a user's profile (respecting privacy settings):

```typescript
interface UserProfile {
    // Always visible
    id: string;
    name: string;
    avatar?: string;
    followerCount: number;
    joinedAt: Date;

    // Visible if profileVisibility = 'public'
    bio?: string;

    // Visible if showCoursesOnProfile = true
    publicCoursesCreated: CoursePreview[];

    // Never publicly visible
    // - enrolledCourses (private)
    // - progress (private)
    // - email (private)
}
```

---

## Authentication

Users authenticate via Auth.js (NextAuth) with:

| Provider       | MVP         |
| -------------- | ----------- |
| Email/Password | ✅ Yes      |
| Google OAuth   | ✅ Yes      |
| GitHub OAuth   | ❌ Post-MVP |
| Magic link     | ❌ Post-MVP |

---

## Deferred to Post-MVP

| Feature                       | Notes                                       |
| ----------------------------- | ------------------------------------------- |
| **Teacher progress tracking** | Group Leaders see detailed student progress |
| **Direct messaging**          | User-to-user communication                  |
| **Activity feed**             | See actions from followed users             |
| **Notifications for follows** | "User X created a new course"               |
| **Teams/Organizations**       | Company accounts with billing               |
| **Verified accounts**         | Checkmarks for notable educators            |
| **Achievements/Badges**       | Gamification elements                       |

---

## Database Schema

> **See [Database Schema Reference](/docs/reference/database-schema)** for complete Prisma model definitions including User, CourseMembership, CourseGroup, GroupMembership, and related tables.

Key models for user management:

- **User** — Core user identity and settings
- **CourseMembership** — Links users to courses with a single role (CREATOR, ADMIN, STUDENT)
- **GroupMembership** — Links users to groups within a course (separate from course membership)
- **CourseGroup** — Groups/cohorts within a course with join policies
- **Follow** — User-to-user following relationships
- **CourseInvitation** — Pending invitations to courses
- **InviteCode** — Shareable codes for joining courses/groups
