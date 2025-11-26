---
name: api-design
description: Route handlers, server actions, and REST API patterns for Next.js. Use when creating API endpoints, server actions, or data fetching patterns. Triggers include "API endpoint", "route handler", "server action".
---

# API Design Skill

## Purpose & Context (WHY)

This skill provides patterns for building APIs in Next.js using route handlers and server actions. Server actions are preferred for mutations, while route handlers are used for REST APIs and webhooks.

**When to use**: Creating new endpoints, implementing data mutations, or designing API structure.

**When to skip**: For simple data fetching that can use server components directly.

## API Patterns

### When to Use Each

| Pattern          | Use for                                    | Example                       |
| ---------------- | ------------------------------------------ | ----------------------------- |
| Server Action    | Form submissions, mutations                | Create course, update profile |
| Route Handler    | REST APIs, webhooks, external integrations | `/api/webhooks/stripe`        |
| Server Component | Simple data fetching                       | Display user courses          |

## Server Actions

### Location

```
apps/web/src/app/actions/
├── auth.ts      # Authentication actions
├── user.ts      # User-related actions
├── course.ts    # Course actions
└── ...
```

### Pattern

```typescript
"use server";

import { z } from "zod";
import { prisma } from "@/services/db/db-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const CreateCourseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
});

export async function createCourse(formData: FormData) {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    // 2. Validate input
    const parsed = CreateCourseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!parsed.success) {
        return { error: "Invalid input", details: parsed.error.flatten() };
    }

    // 3. Execute operation
    try {
        const course = await prisma.course.create({
            data: {
                ...parsed.data,
                createdById: session.user.id,
            },
        });

        return { success: true, data: course };
    } catch (error) {
        console.error("Failed to create course:", error);
        return { error: "Failed to create course" };
    }
}
```

### Usage in Components

```tsx
"use client";

import { createCourse } from "@/app/actions/course";

export function CreateCourseForm() {
    async function handleSubmit(formData: FormData) {
        const result = await createCourse(formData);
        if (result.error) {
            // Handle error
        } else {
            // Handle success
        }
    }

    return (
        <form action={handleSubmit}>
            <input name="title" required />
            <button type="submit">Create</button>
        </form>
    );
}
```

## Route Handlers

### Location

```
apps/web/src/app/api/
├── auth/[...nextauth]/route.ts
├── webhooks/
│   └── stripe/route.ts
└── courses/
    ├── route.ts           # GET /api/courses, POST /api/courses
    └── [id]/route.ts      # GET /api/courses/:id, PUT, DELETE
```

### Pattern

```typescript
// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/services/db/db-client";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
        where: { createdById: session.user.id },
    });

    return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Validate and create...

    return NextResponse.json(course, { status: 201 });
}
```

## Error Handling

### Consistent Error Format

```typescript
interface ApiError {
    error: string;
    message?: string;
    details?: unknown;
}

// Usage
return NextResponse.json(
    { error: "Validation failed", details: errors },
    { status: 400 }
);
```

### HTTP Status Codes

| Code | Use for                  |
| ---- | ------------------------ |
| 200  | Success (GET, PUT)       |
| 201  | Created (POST)           |
| 204  | No content (DELETE)      |
| 400  | Bad request (validation) |
| 401  | Unauthorized             |
| 403  | Forbidden                |
| 404  | Not found                |
| 500  | Server error             |

## Resources

**This Skill**:

- `reference/api-patterns.md` - Advanced API patterns

**Related Skills**:

- `validation` - Zod schemas for request validation
- `authentication` - Auth patterns for APIs
- `database` - Prisma queries in handlers

## Key Principle

Predictable APIs with proper error handling and validation.

---

_Skill established November 2025 for the Learning App (Cognia) project._
