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

// =============================================================================
// COURSE REVIEWS
// =============================================================================

/**
 * User progress metrics for a course
 */
export interface UserCourseProgress {
    completionPercent: number; // % of IPs introduced (0-100)
    masteryPercent: number; // Average mastery across attempted IPs (0-100)
    totalIPs: number;
    introducedIPs: number;
}

/**
 * Get the current user's progress in a course.
 * Returns completion % (IPs introduced) and mastery % (average mastery).
 */
export async function getUserCourseProgress(
    courseId: string
): Promise<
    { success: true; progress: UserCourseProgress } | { error: string }
> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to view progress" };
    }

    try {
        // Get all information points for the course
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: {
                        lessons: {
                            include: {
                                informationPoints: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return { error: "Course not found" };
        }

        // Flatten all IP IDs
        const allIPIds = course.modules.flatMap((m) =>
            m.lessons.flatMap((l) => l.informationPoints.map((ip) => ip.id))
        );

        const totalIPs = allIPIds.length;

        if (totalIPs === 0) {
            return {
                success: true,
                progress: {
                    completionPercent: 0,
                    masteryPercent: 0,
                    totalIPs: 0,
                    introducedIPs: 0,
                },
            };
        }

        // Get user's progress on these IPs
        const progressRecords = await prisma.informationPointProgress.findMany({
            where: {
                userId: session.user.id,
                informationPointId: { in: allIPIds },
            },
            select: {
                state: true,
                masteryLevel: true,
                introducedAt: true,
            },
        });

        // Count introduced IPs (state !== UNSEEN or introducedAt is set)
        const introducedIPs = progressRecords.filter(
            (p) => p.state !== "UNSEEN" || p.introducedAt !== null
        ).length;

        // Calculate average mastery across IPs with progress
        const ipsWithMastery = progressRecords.filter(
            (p) => p.masteryLevel > 0
        );
        const averageMastery =
            ipsWithMastery.length > 0
                ? ipsWithMastery.reduce((sum, p) => sum + p.masteryLevel, 0) /
                  ipsWithMastery.length
                : 0;

        return {
            success: true,
            progress: {
                completionPercent: Math.round((introducedIPs / totalIPs) * 100),
                masteryPercent: Math.round(averageMastery * 100),
                totalIPs,
                introducedIPs,
            },
        };
    } catch (error) {
        console.error("Get user course progress error:", error);
        return { error: "Failed to get course progress" };
    }
}

/**
 * Review data for display
 */
export interface CourseReviewData {
    id: string;
    rating: number;
    review: string | null;
    completionPercent: number;
    masteryPercent: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

/**
 * Paginated reviews response
 */
export interface PaginatedReviews {
    reviews: CourseReviewData[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
}

/**
 * Get paginated reviews for a course.
 */
export async function getCourseReviews(
    courseId: string,
    page: number = 1,
    pageSize: number = 20
): Promise<{ success: true; data: PaginatedReviews } | { error: string }> {
    try {
        const skip = (page - 1) * pageSize;

        const [reviews, totalCount] = await Promise.all([
            prisma.courseRating.findMany({
                where: { courseId },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            }),
            prisma.courseRating.count({ where: { courseId } }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            success: true,
            data: {
                reviews: reviews.map((r) => ({
                    id: r.id,
                    rating: r.rating,
                    review: r.review,
                    completionPercent: r.completionPercent,
                    masteryPercent: r.masteryPercent,
                    createdAt: r.createdAt.toISOString(),
                    updatedAt: r.updatedAt.toISOString(),
                    user: {
                        id: r.user.id,
                        name: r.user.name,
                        image: r.user.image,
                    },
                })),
                totalCount,
                totalPages,
                currentPage: page,
                hasMore: page < totalPages,
            },
        };
    } catch (error) {
        console.error("Get course reviews error:", error);
        return { error: "Failed to get course reviews" };
    }
}

/**
 * Get a limited number of reviews for preview (e.g., on course page).
 */
export async function getCourseReviewsPreview(
    courseId: string,
    limit: number = 3
): Promise<
    | { success: true; reviews: CourseReviewData[]; totalCount: number }
    | { error: string }
> {
    try {
        const [reviews, totalCount] = await Promise.all([
            prisma.courseRating.findMany({
                where: { courseId },
                orderBy: { createdAt: "desc" },
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            }),
            prisma.courseRating.count({ where: { courseId } }),
        ]);

        return {
            success: true,
            reviews: reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                review: r.review,
                completionPercent: r.completionPercent,
                masteryPercent: r.masteryPercent,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
                user: {
                    id: r.user.id,
                    name: r.user.name,
                    image: r.user.image,
                },
            })),
            totalCount,
        };
    } catch (error) {
        console.error("Get course reviews preview error:", error);
        return { error: "Failed to get course reviews" };
    }
}

/**
 * Get the current user's review for a course (if any).
 */
export async function getUserCourseReview(
    courseId: string
): Promise<
    { success: true; review: CourseReviewData | null } | { error: string }
> {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: true, review: null };
    }

    try {
        const rating = await prisma.courseRating.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!rating) {
            return { success: true, review: null };
        }

        return {
            success: true,
            review: {
                id: rating.id,
                rating: rating.rating,
                review: rating.review,
                completionPercent: rating.completionPercent,
                masteryPercent: rating.masteryPercent,
                createdAt: rating.createdAt.toISOString(),
                updatedAt: rating.updatedAt.toISOString(),
                user: {
                    id: rating.user.id,
                    name: rating.user.name,
                    image: rating.user.image,
                },
            },
        };
    } catch (error) {
        console.error("Get user course review error:", error);
        return { error: "Failed to get user review" };
    }
}

/**
 * Submit or update a course review.
 * Only enrolled users can submit reviews.
 * Captures user's current progress at time of review.
 */
export async function submitCourseReview(
    courseId: string,
    rating: number,
    review?: string
): Promise<{ success: true; message: string } | { error: string }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to submit a review" };
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return { error: "Rating must be an integer between 1 and 5" };
    }

    try {
        // Check enrollment
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!membership) {
            return {
                error: "You must be enrolled in this course to submit a review",
            };
        }

        // Get user's current progress
        const progressResult = await getUserCourseProgress(courseId);
        if ("error" in progressResult) {
            return { error: progressResult.error };
        }

        const { completionPercent, masteryPercent } = progressResult.progress;

        // Upsert the review
        await prisma.courseRating.upsert({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
            update: {
                rating,
                review: review?.trim() || null,
                completionPercent,
                masteryPercent,
            },
            create: {
                userId: session.user.id,
                courseId,
                rating,
                review: review?.trim() || null,
                completionPercent,
                masteryPercent,
            },
        });

        // Update denormalized rating on course
        const ratingStats = await prisma.courseRating.aggregate({
            where: { courseId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.course.update({
            where: { id: courseId },
            data: {
                averageRating: ratingStats._avg.rating,
                ratingCount: ratingStats._count.rating,
            },
        });

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}/reviews`);

        return { success: true, message: "Review submitted successfully" };
    } catch (error) {
        console.error("Submit course review error:", error);
        return { error: "Failed to submit review" };
    }
}

/**
 * Delete the current user's review for a course.
 */
export async function deleteCourseReview(
    courseId: string
): Promise<{ success: true; message: string } | { error: string }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to delete a review" };
    }

    try {
        // Check if review exists
        const existingReview = await prisma.courseRating.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!existingReview) {
            return { error: "No review found to delete" };
        }

        // Delete the review
        await prisma.courseRating.delete({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        // Update denormalized rating on course
        const ratingStats = await prisma.courseRating.aggregate({
            where: { courseId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.course.update({
            where: { id: courseId },
            data: {
                averageRating: ratingStats._avg.rating ?? null,
                ratingCount: ratingStats._count.rating,
            },
        });

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}/reviews`);

        return { success: true, message: "Review deleted successfully" };
    } catch (error) {
        console.error("Delete course review error:", error);
        return { error: "Failed to delete review" };
    }
}
