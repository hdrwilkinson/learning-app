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
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { headers } from "next/headers";
import {
    signupLimiter,
    resendVerificationLimiter,
    getClientIp,
    checkRateLimit,
} from "@/lib/rate-limit";

export async function signup(data: SignupInput) {
    // Rate limiting: Check by IP
    const headersList = await headers();
    const ip = getClientIp(headersList);
    const rateLimitResult = await checkRateLimit(ip, signupLimiter);

    if (!rateLimitResult.success) {
        return {
            error: "Too many signup attempts",
            message: `Rate limit exceeded. Please try again after ${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)} seconds.`,
        };
    }

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

        // Generate verification token and send email
        try {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(email, verificationToken.token);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Don't fail signup if email fails, but log it
        }

        return {
            success: true,
            message:
                "Account created successfully. Please check your email to verify your account.",
        };
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

export async function verifyEmail(token: string) {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return { error: "Invalid verification token" };
        }

        if (verificationToken.expires < new Date()) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { token },
            });
            return { error: "Verification token has expired" };
        }

        // Find user by email (identifier)
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            return { error: "User not found" };
        }

        if (user.emailVerified) {
            // Already verified, delete token and return success
            await prisma.verificationToken.delete({
                where: { token },
            });
            return { success: true, message: "Email already verified" };
        }

        // Update user emailVerified field
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
        });

        // Delete verification token
        await prisma.verificationToken.delete({
            where: { token },
        });

        return { success: true, message: "Email verified successfully" };
    } catch (error) {
        console.error("Verify email error:", error);
        return { error: "Failed to verify email" };
    }
}

export async function resendVerificationEmail(email: string) {
    // Rate limiting: Check by email
    const rateLimitResult = await checkRateLimit(
        email.toLowerCase(),
        resendVerificationLimiter
    );

    if (!rateLimitResult.success) {
        return {
            error: "Too many requests",
            message: `Rate limit exceeded. Please try again after ${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)} seconds.`,
        };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if email exists or not for security
            return {
                success: true,
                message:
                    "If an account exists with this email, a verification link has been sent.",
            };
        }

        if (user.emailVerified) {
            return { error: "Email is already verified" };
        }

        // Generate new verification token and send email
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);

        return {
            success: true,
            message: "Verification email sent. Please check your inbox.",
        };
    } catch (error) {
        console.error("Resend verification email error:", error);
        // Return the actual error message if it's an Error instance, otherwise generic message
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to send verification email";
        return { error: errorMessage };
    }
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

export async function getConnectedAccounts(userId: string) {
    // Verify the requesting user matches the target userId
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { error: "Unauthorized" };
    }

    try {
        const accounts = await prisma.account.findMany({
            where: { userId },
            select: {
                id: true,
                provider: true,
                providerAccountId: true,
                type: true,
            },
        });

        return { success: true, accounts };
    } catch (error) {
        console.error("Get connected accounts error:", error);
        return { error: "Failed to fetch connected accounts" };
    }
}

export async function disconnectAccount(userId: string, accountId: string) {
    // Verify the requesting user matches the target userId
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify the account belongs to the user
        const account = await prisma.account.findUnique({
            where: { id: accountId },
            select: { userId: true },
        });

        if (!account || account.userId !== userId) {
            return { error: "Account not found" };
        }

        // Check if user has password or other OAuth accounts
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                password: true,
                accounts: {
                    select: { id: true },
                },
            },
        });

        if (!user) {
            return { error: "User not found" };
        }

        // Prevent disconnecting if it's the last authentication method
        const hasPassword = !!user.password;
        const oauthAccountCount = user.accounts.length;
        const isLastOAuthAccount = oauthAccountCount === 1;

        if (!hasPassword && isLastOAuthAccount) {
            return {
                error: "Cannot disconnect last authentication method. Please set a password first or connect another account.",
            };
        }

        // Delete the account
        await prisma.account.delete({
            where: { id: accountId },
        });

        return { success: true };
    } catch (error) {
        console.error("Disconnect account error:", error);
        return { error: "Failed to disconnect account" };
    }
}
