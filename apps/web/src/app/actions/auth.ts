"use server";

import {
    SignupSchema,
    SignupInput,
    OnboardingSchema,
    OnboardingInput,
} from "@repo/api";
import { prisma } from "../../../../../services/db/db-client";
import bcrypt from "bcrypt";
import { generateUsername } from "@repo/lib";

export async function signup(data: SignupInput) {
    const result = SignupSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input", details: result.error.flatten() };
    }

    const { name, email, password, dateOfBirth, country, bio } = result.data;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already exists" };
    }

    // Generate username
    let username = generateUsername();
    let exists = await prisma.user.findUnique({ where: { username } });
    let retries = 0;
    while (exists && retries < 3) {
        username = generateUsername();
        exists = await prisma.user.findUnique({ where: { username } });
        retries++;
    }

    if (exists) {
        return {
            error: "Failed to generate unique username. Please try again.",
        };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                username,
                dateOfBirth,
                country,
                bio,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Failed to create account" };
    }
}

export async function updateProfile(userId: string, data: OnboardingInput) {
    const result = OnboardingSchema.safeParse(data);
    if (!result.success) {
        return { error: "Invalid input", details: result.error.flatten() };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                dateOfBirth: result.data.dateOfBirth,
                country: result.data.country,
                bio: result.data.bio,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }
}
