"use server";

import { prisma } from "../../../../../services/db/db-client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Enroll the current user in a course as a STUDENT.
 */
export async function enrollInCourse(courseId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to enroll in a course" };
    }

    try {
        // Check if course exists and is public
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                visibility: "PUBLIC",
                generationStatus: "COMPLETED",
            },
        });

        if (!course) {
            return {
                error: "Course not found or not available for enrollment",
            };
        }

        // Check if already enrolled
        const existingMembership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (existingMembership) {
            return { error: "You are already enrolled in this course" };
        }

        // Create membership
        await prisma.courseMembership.create({
            data: {
                userId: session.user.id,
                courseId,
                courseRole: "STUDENT",
            },
        });

        revalidatePath(`/courses/${courseId}`);

        return { success: true, message: "Successfully enrolled in course" };
    } catch (error) {
        console.error("Enroll in course error:", error);
        return { error: "Failed to enroll in course" };
    }
}

/**
 * Unenroll the current user from a course.
 * Cannot unenroll if user is the CREATOR.
 */
export async function unenrollFromCourse(courseId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to unenroll from a course" };
    }

    try {
        // Find existing membership
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!membership) {
            return { error: "You are not enrolled in this course" };
        }

        // Prevent creator from unenrolling
        if (membership.courseRole === "CREATOR") {
            return {
                error: "Course creators cannot unenroll. Transfer ownership or delete the course instead.",
            };
        }

        // Delete membership
        await prisma.courseMembership.delete({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        revalidatePath(`/courses/${courseId}`);

        return {
            success: true,
            message: "Successfully unenrolled from course",
        };
    } catch (error) {
        console.error("Unenroll from course error:", error);
        return { error: "Failed to unenroll from course" };
    }
}

/**
 * Get enrollment status for the current user and a specific course.
 * Returns enrollment info and course member count.
 */
export async function getEnrollmentStatus(courseId: string) {
    const session = await auth();

    try {
        // Get member count for the course
        const memberCount = await prisma.courseMembership.count({
            where: { courseId },
        });

        // If not logged in, return just the member count
        if (!session?.user?.id) {
            return {
                success: true,
                isEnrolled: false,
                role: null,
                memberCount,
            };
        }

        // Check user's membership
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
            select: {
                courseRole: true,
            },
        });

        return {
            success: true,
            isEnrolled: !!membership,
            role: membership?.courseRole ?? null,
            memberCount,
        };
    } catch (error) {
        console.error("Get enrollment status error:", error);
        return {
            error: "Failed to get enrollment status",
            isEnrolled: false,
            role: null,
            memberCount: 0,
        };
    }
}

/**
 * Leave a course (unenroll).
 * Alias for unenrollFromCourse with user-friendly naming.
 */
export async function leaveCourse(courseId: string) {
    return unenrollFromCourse(courseId);
}

/**
 * Course settings type for updates
 */
export interface CourseSettingsInput {
    // Schedule
    schedule?: {
        daysPerWeek: string[];
        minutesPerSession: number;
    } | null;
    // Notifications
    emailReminders?: boolean;
    pushNotifications?: boolean;
    weeklyProgressEmail?: boolean;
    // Privacy
    showProgressToGroup?: boolean;
    appearInLeaderboards?: boolean;
}

/**
 * Get current course settings for the authenticated user.
 */
export async function getCourseSettings(courseId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to view course settings" };
    }

    try {
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
            select: {
                courseRole: true,
                schedule: true,
                emailReminders: true,
                pushNotifications: true,
                weeklyProgressEmail: true,
                showProgressToGroup: true,
                appearInLeaderboards: true,
            },
        });

        if (!membership) {
            return { error: "You are not enrolled in this course" };
        }

        return {
            success: true,
            settings: {
                role: membership.courseRole,
                schedule: membership.schedule as {
                    daysPerWeek: string[];
                    minutesPerSession: number;
                } | null,
                emailReminders: membership.emailReminders,
                pushNotifications: membership.pushNotifications,
                weeklyProgressEmail: membership.weeklyProgressEmail,
                showProgressToGroup: membership.showProgressToGroup,
                appearInLeaderboards: membership.appearInLeaderboards,
            },
        };
    } catch (error) {
        console.error("Get course settings error:", error);
        return { error: "Failed to get course settings" };
    }
}

/**
 * Update course settings for the authenticated user.
 */
export async function updateCourseSettings(
    courseId: string,
    settings: CourseSettingsInput
) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to update course settings" };
    }

    try {
        // Verify membership exists
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!membership) {
            return { error: "You are not enrolled in this course" };
        }

        // Build update data - only include fields that were provided
        const updateData: {
            schedule?: unknown;
            emailReminders?: boolean;
            pushNotifications?: boolean;
            weeklyProgressEmail?: boolean;
            showProgressToGroup?: boolean;
            appearInLeaderboards?: boolean;
        } = {};

        if (settings.schedule !== undefined) {
            updateData.schedule = settings.schedule;
        }
        if (settings.emailReminders !== undefined) {
            updateData.emailReminders = settings.emailReminders;
        }
        if (settings.pushNotifications !== undefined) {
            updateData.pushNotifications = settings.pushNotifications;
        }
        if (settings.weeklyProgressEmail !== undefined) {
            updateData.weeklyProgressEmail = settings.weeklyProgressEmail;
        }
        if (settings.showProgressToGroup !== undefined) {
            updateData.showProgressToGroup = settings.showProgressToGroup;
        }
        if (settings.appearInLeaderboards !== undefined) {
            updateData.appearInLeaderboards = settings.appearInLeaderboards;
        }

        await prisma.courseMembership.update({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
            data: updateData,
        });

        revalidatePath(`/courses/${courseId}/settings`);

        return { success: true, message: "Settings updated successfully" };
    } catch (error) {
        console.error("Update course settings error:", error);
        return { error: "Failed to update course settings" };
    }
}
