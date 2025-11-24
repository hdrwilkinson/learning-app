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
import { auth } from "@/auth";

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
        const updateData: {
            dateOfBirth: Date;
            country: string;
            bio?: string;
            username?: string;
        } = {
            dateOfBirth: result.data.dateOfBirth,
            country: result.data.country,
            bio: result.data.bio,
        };

        // Handle username update if provided and different
        if (result.data.username) {
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { username: true },
            });

            if (currentUser?.username !== result.data.username) {
                // Check uniqueness
                const existingUser = await prisma.user.findUnique({
                    where: { username: result.data.username },
                });

                if (existingUser) {
                    return { error: "Username is already taken" };
                }
                updateData.username = result.data.username;
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }
}

export async function checkUsernameAvailability(
    username: string,
    currentUserId?: string
) {
    const user = await prisma.user.findUnique({
        where: { username },
    });
    // If a user exists but it's the current user, it's still available
    if (user && currentUserId && user.id === currentUserId) {
        return { available: true };
    }
    return { available: !user };
}

export async function deleteAccount(userId: string) {
    // Verify the requesting user matches the target userId
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { error: "Unauthorized" };
    }

    try {
        // Manually delete related records that don't have cascading relations
        // Delete CuriosityChat (messages will cascade automatically)
        await prisma.curiosityChat.deleteMany({
            where: { userId },
        });

        // Delete QuizResponse
        await prisma.quizResponse.deleteMany({
            where: { userId },
        });

        // Delete the User record (cascades to Account, Session, Course, UserProgress, etc.)
        await prisma.user.delete({
            where: { id: userId },
        });

        return { success: true };
    } catch (error) {
        console.error("Delete account error:", error);
        return { error: "Failed to delete account" };
    }
}
