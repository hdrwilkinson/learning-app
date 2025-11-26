---
name: database
description: Prisma schema design, migrations, queries, and relations. Use when working with database operations, schema changes, or complex queries. Triggers include "prisma", "database", "migration", "schema".
---

# Database Skill

## Purpose & Context (WHY)

This skill provides patterns for working with PostgreSQL via Prisma. It covers schema design, migrations, queries, and relations. The database is the foundation of the application's data layer.

**When to use**: Adding new models, creating migrations, writing complex queries, or optimizing database operations.

**When to skip**: For simple read operations that are already implemented.

## Schema Location

```
prisma/
├── schema.prisma    # Main schema file
└── migrations/      # Generated migrations
```

## Common Workflows

### 1. Adding a New Model

```prisma
// prisma/schema.prisma
model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  modules     Module[]
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
}
```

### 2. Creating a Migration

```bash
# Create migration (development)
npx prisma migrate dev --name add_course_model

# Apply migration (production)
npx prisma migrate deploy
```

### 3. Generating Client

```bash
npx prisma generate
```

## Schema Patterns

### Naming Conventions

| Element  | Convention  | Example                           |
| -------- | ----------- | --------------------------------- |
| Model    | PascalCase  | `User`, `Course`, `LearningPath`  |
| Field    | camelCase   | `createdAt`, `userId`, `isActive` |
| Relation | Descriptive | `createdBy`, `enrolledCourses`    |

### Common Field Patterns

```prisma
// Primary key
id        String   @id @default(cuid())

// Timestamps
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Soft delete
deletedAt DateTime?

// Enum field
status    Status   @default(DRAFT)
```

### Relations

```prisma
// One-to-Many
model User {
  courses Course[]
}

model Course {
  userId String
  user   User   @relation(fields: [userId], references: [id])
}

// Many-to-Many (explicit)
model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
}
```

## Query Patterns

### Basic CRUD

```typescript
import { prisma } from "@/services/db/db-client";

// Create
const course = await prisma.course.create({
    data: { title: "New Course", createdById: userId },
});

// Read
const courses = await prisma.course.findMany({
    where: { createdById: userId },
    include: { modules: true },
});

// Update
await prisma.course.update({
    where: { id: courseId },
    data: { title: "Updated Title" },
});

// Delete
await prisma.course.delete({
    where: { id: courseId },
});
```

### With Relations

```typescript
// Include relations
const courseWithModules = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
        modules: {
            include: { lessons: true },
        },
    },
});

// Select specific fields
const titles = await prisma.course.findMany({
    select: { id: true, title: true },
});
```

## Migration Best Practices

1. **Small, focused migrations**: One change per migration
2. **Descriptive names**: `add_user_email_index`, `create_course_table`
3. **Test locally**: Always run `migrate dev` before `migrate deploy`
4. **Data migrations**: Handle in separate scripts, not schema migrations

## Prisma Client Singleton

Always use the singleton pattern to avoid connection leaks:

```typescript
// services/db/db-client.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Resources

**This Skill**:

- `reference/query-patterns.md` - Advanced query patterns

**Related Skills**:

- `validation` - Zod schemas for data validation
- `api-design` - API endpoints that use database

## Key Principle

Schema-first design with type-safe queries.

---

_Skill established November 2025 for the Learning App (Cognia) project._
