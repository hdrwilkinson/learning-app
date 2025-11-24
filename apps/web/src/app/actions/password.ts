"use server";

import * as z from "zod";
import {
    ResetPasswordSchema,
    NewPasswordSchema,
    ChangePasswordSchema,
    SetPasswordSchema,
} from "@repo/api";
import { prisma } from "../../../../../services/db/db-client";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcrypt";
import { auth } from "@/auth";

export const resetPassword = async (
    values: z.infer<typeof ResetPasswordSchema>
) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    try {
        await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        );
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to send reset email. Please try again later.",
        };
    }

    return { success: "Reset email sent!" };
};

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password } = validatedFields.data;

    const existingToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email },
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
    });

    return { success: "Password updated!" };
};

export const changePassword = async (
    values: z.infer<typeof ChangePasswordSchema>
) => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const validatedFields = ChangePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || !user.password) {
        return { error: "User not found or password not set" };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordsMatch) {
        return { error: "Incorrect current password!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return { success: "Password updated!" };
};

export const setPassword = async (
    values: z.infer<typeof SetPasswordSchema>
) => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const validatedFields = SetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { newPassword } = validatedFields.data;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return { error: "User not found" };
    }

    // Only allow this if password is currently null
    if (user.password) {
        return { error: "Password already set. Use change password instead." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return { success: "Password set successfully!" };
};
