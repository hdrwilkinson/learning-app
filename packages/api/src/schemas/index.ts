/**
 * Zod schemas for API validation
 */

import { z } from "zod";

// User schemas
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Course schemas
export const CourseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Course = z.infer<typeof CourseSchema>;

// Add more schemas as needed
