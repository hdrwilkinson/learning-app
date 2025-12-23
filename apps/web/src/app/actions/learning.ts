"use server";

import { prisma } from "../../../../../services/db/db-client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Information Point data for learning mode.
 */
export interface LearnableIP {
    id: string;
    title: string;
    content: string;
    order: number;
    type: string | null;
    lesson: {
        id: string;
        title: string;
        description: string | null;
    };
    module: {
        id: string;
        title: string;
    };
    /** Previously completed IP titles for context */
    prerequisites: string[];
}

/**
 * Get the next N unseen information points for a course.
 * IPs are returned in order: module.order -> lesson.order -> ip.order
 *
 * An IP is "unseen" if the user has no progress record OR state is UNSEEN.
 */
export async function getNextUnseenIPs(
    courseId: string,
    limit: number = 3
): Promise<{ success: true; ips: LearnableIP[] } | { error: string }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to practice" };
    }

    try {
        // Verify user is enrolled in the course
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!membership) {
            return { error: "You must be enrolled in this course to practice" };
        }

        // Get all IPs for the course with their progress
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                            include: {
                                informationPoints: {
                                    orderBy: { order: "asc" },
                                    include: {
                                        type: true,
                                        progress: {
                                            where: { userId: session.user.id },
                                        },
                                    },
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

        // Flatten and filter for unseen IPs
        const unseenIPs: LearnableIP[] = [];
        const completedIPTitles: string[] = [];

        for (const courseModule of course.modules) {
            for (const lesson of courseModule.lessons) {
                for (const ip of lesson.informationPoints) {
                    const progress = ip.progress[0];
                    const isUnseen = !progress || progress.state === "UNSEEN";

                    if (isUnseen && unseenIPs.length < limit) {
                        unseenIPs.push({
                            id: ip.id,
                            title: ip.title,
                            content: ip.content,
                            order: ip.order,
                            type: ip.type?.name ?? null,
                            lesson: {
                                id: lesson.id,
                                title: lesson.title,
                                description: lesson.description,
                            },
                            module: {
                                id: courseModule.id,
                                title: courseModule.title,
                            },
                            prerequisites: [...completedIPTitles],
                        });
                    } else if (!isUnseen) {
                        // Track completed IPs for prerequisites
                        completedIPTitles.push(ip.title);
                    }
                }
            }
        }

        return { success: true, ips: unseenIPs };
    } catch (error) {
        console.error("Get next unseen IPs error:", error);
        return { error: "Failed to get practice content" };
    }
}

/**
 * Mark an information point as introduced (learned).
 * Creates or updates the progress record with state LEARNING.
 */
export async function markIPAsIntroduced(
    informationPointId: string
): Promise<{ success: true } | { error: string }> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in" };
    }

    try {
        // Verify the IP exists and get course ID for revalidation
        const ip = await prisma.informationPoint.findUnique({
            where: { id: informationPointId },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ip) {
            return { error: "Information point not found" };
        }

        const courseId = ip.lesson.module.course.id;

        // Verify user is enrolled
        const membership = await prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (!membership) {
            return { error: "You must be enrolled in this course" };
        }

        // Upsert progress record
        await prisma.informationPointProgress.upsert({
            where: {
                userId_informationPointId: {
                    userId: session.user.id,
                    informationPointId,
                },
            },
            update: {
                state: "LEARNING",
                introducedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                informationPointId,
                state: "LEARNING",
                introducedAt: new Date(),
                masteryLevel: 0,
                baselineMastery: 0,
                baselineConfidence: 0,
                stability: 1,
            },
        });

        // Revalidate course page to update progress
        revalidatePath(`/courses/${courseId}`);

        return { success: true };
    } catch (error) {
        console.error("Mark IP as introduced error:", error);
        return { error: "Failed to save progress" };
    }
}

/**
 * Get count of unseen IPs remaining in a course.
 */
export async function getUnseenIPCount(
    courseId: string
): Promise<
    { success: true; count: number; total: number } | { error: string }
> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in" };
    }

    try {
        // Get all IP IDs for the course
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

        const allIPIds = course.modules.flatMap((m) =>
            m.lessons.flatMap((l) => l.informationPoints.map((ip) => ip.id))
        );

        const total = allIPIds.length;

        // Count IPs with progress that are not UNSEEN
        const seenCount = await prisma.informationPointProgress.count({
            where: {
                userId: session.user.id,
                informationPointId: { in: allIPIds },
                state: { not: "UNSEEN" },
            },
        });

        return {
            success: true,
            count: total - seenCount,
            total,
        };
    } catch (error) {
        console.error("Get unseen IP count error:", error);
        return { error: "Failed to get count" };
    }
}
