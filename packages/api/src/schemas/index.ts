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
export const SignupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
        dateOfBirth: z.coerce.date(),
        country: z.string().min(2, "Country is required"),
        bio: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const NewPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
        token: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type NewPasswordInput = z.infer<typeof NewPasswordSchema>;

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const SetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SetPasswordInput = z.infer<typeof SetPasswordSchema>;

export const OnboardingSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional()
        .or(z.literal("")),
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
