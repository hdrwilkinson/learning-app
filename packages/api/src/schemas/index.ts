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

// Auth schemas
export const SignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    dateOfBirth: z.coerce.date(),
    country: z.string().min(2, "Country is required"),
    bio: z.string().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const OnboardingSchema = z.object({
    dateOfBirth: z.coerce.date(),
    country: z.string().min(2, "Country is required"),
    bio: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

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
