---
name: validation
description: Zod schemas for form validation and API validation. Use when validating input, handling forms, or API request validation. Triggers include "validation", "zod", "form validation", "input validation".
---

# Validation Skill

## Purpose & Context (WHY)

This skill provides patterns for data validation using Zod. Validation happens at system boundaries: user input, API requests, and external data. Internal code can trust validated data.

**When to use**: Creating form validation, API request validation, or parsing external data.

**When to skip**: For internal function parameters that are already type-checked.

## Schema Location

```
packages/api/src/schemas/
├── index.ts       # Barrel export
├── user.ts        # User-related schemas
├── course.ts      # Course-related schemas
└── common.ts      # Shared schemas (pagination, etc.)
```

## Basic Patterns

### Defining Schemas

```typescript
import { z } from "zod";

// Simple object
export const UserSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email"),
    age: z.number().int().min(0).optional(),
});

// Infer TypeScript type
export type User = z.infer<typeof UserSchema>;
```

### Common Validators

```typescript
// Strings
z.string().min(1); // Required
z.string().max(100); // Max length
z.string().email(); // Email format
z.string().url(); // URL format
z.string().uuid(); // UUID format
z.string().regex(/pattern/); // Custom regex

// Numbers
z.number().int(); // Integer
z.number().positive(); // > 0
z.number().min(0).max(100); // Range

// Dates
z.date();
z.string().datetime(); // ISO datetime string

// Enums
z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

// Arrays
z.array(z.string()).min(1); // At least one item

// Optional and nullable
z.string().optional(); // undefined allowed
z.string().nullable(); // null allowed
z.string().nullish(); // null or undefined
```

## Form Validation

### With React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', description: '' },
  });

  function onSubmit(data: FormData) {
    // data is typed and validated
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('title')} />
      {form.formState.errors.title && (
        <span>{form.formState.errors.title.message}</span>
      )}
    </form>
  );
}
```

## API Validation

### Server Action Pattern

```typescript
"use server";

import { z } from "zod";

const CreateCourseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
});

export async function createCourse(formData: FormData) {
    const parsed = CreateCourseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!parsed.success) {
        return {
            error: "Validation failed",
            details: parsed.error.flatten(),
        };
    }

    // parsed.data is typed and validated
    const { title, description } = parsed.data;
    // ... create course
}
```

### Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const parsed = QuerySchema.safeParse({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid parameters", details: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { page, limit } = parsed.data;
    // ... fetch data with pagination
}
```

## Advanced Patterns

### Schema Composition

```typescript
// Base schema
const BaseSchema = z.object({
    id: z.string().cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Extend for specific types
const CourseSchema = BaseSchema.extend({
    title: z.string(),
    published: z.boolean(),
});

// Pick specific fields
const CreateCourseSchema = CourseSchema.pick({
    title: true,
});

// Omit fields
const PublicCourseSchema = CourseSchema.omit({
    createdAt: true,
    updatedAt: true,
});
```

### Transform and Refine

```typescript
// Transform input
const SlugSchema = z
    .string()
    .transform((val) => val.toLowerCase().replace(/\s+/g, "-"));

// Custom validation
const PasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
        (val) => /[A-Z]/.test(val),
        "Password must contain uppercase letter"
    );
```

## Resources

**This Skill**:

- `reference/zod-patterns.md` - Advanced Zod patterns

**Related Skills**:

- `api-design` - API validation patterns
- `database` - Prisma schema alignment

## Key Principle

Validate at boundaries, trust internal code.

---

_Skill established November 2025 for the Learning App (Cognia) project._
