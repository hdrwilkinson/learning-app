/**
 * Course Detail Page
 *
 * Displays different views based on enrollment status:
 * - Unenrolled: Course content accordion and reviews
 * - Enrolled: Learning dashboard with study modes and lesson path
 */

import { notFound } from "next/navigation";
import { prisma } from "../../../../../../../services/db/db-client";
import type { CourseDetail } from "@/features/courses";
import { auth } from "@/auth";
import { UnenrolledCourseView } from "./_components/UnenrolledCourseView";
import {
    EnrolledCourseView,
    type LessonStatus,
    type DailyProgress,
} from "./_components/EnrolledCourseView";
import type { LearningDataPoint } from "./_components/LearningGraph";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

async function getCourse(courseId: string): Promise<CourseDetail | null> {
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            visibility: "PUBLIC",
            generationStatus: "COMPLETED",
        },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                        include: {
                            _count: {
                                select: { informationPoints: true },
                            },
                        },
                    },
                },
            },
            _count: {
                select: { memberships: true },
            },
        },
    });

    if (!course) {
        return null;
    }

    // Calculate total IPs for time estimates
    const totalInformationPoints = course.modules.reduce(
        (sum, module) =>
            sum +
            module.lessons.reduce(
                (lessonSum, lesson) =>
                    lessonSum + lesson._count.informationPoints,
                0
            ),
        0
    );

    return {
        id: course.id,
        title: course.title,
        description: course.description,
        topic: course.topic,
        imageUrl: course.imageUrl,
        createdAt: course.createdAt.toISOString(),
        averageRating: course.averageRating,
        ratingCount: course.ratingCount,
        memberCount: course._count.memberships,
        estimatedMinutesPerIP: course.estimatedMinutesPerIP,
        totalInformationPoints,
        modules: course.modules.map((module) => ({
            id: module.id,
            title: module.title,
            description: module.description,
            order: module.order,
            lessons: module.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                order: lesson.order,
                informationPointCount: lesson._count.informationPoints,
            })),
        })),
    };
}

async function getEnrollmentStatus(courseId: string, userId: string | null) {
    if (!userId) {
        return { isEnrolled: false };
    }

    const membership = await prisma.courseMembership.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
        select: { courseRole: true },
    });

    return {
        isEnrolled: !!membership,
    };
}

/**
 * Get lesson statuses for enrolled users
 * TODO: Fetch actual progress from LessonProgress table
 */
async function getLessonStatuses(
    courseId: string,
    _userId: string
): Promise<LessonStatus[]> {
    // Get all lessons for the course
    const lessons = await prisma.lesson.findMany({
        where: {
            module: {
                courseId,
            },
        },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        select: {
            id: true,
        },
    });

    // TODO: Fetch actual progress from LessonProgress/InformationPointProgress tables
    // For now, generate mock data: first 2 complete, 3rd current, rest locked
    return lessons.map((lesson, index) => ({
        lessonId: lesson.id,
        status: index < 2 ? "complete" : index === 2 ? "current" : "locked",
    }));
}

/**
 * Get daily progress stats for enrolled user
 * Includes streak, minutes studied today, and target minutes from schedule
 */
async function getDailyProgress(
    courseId: string,
    userId: string
): Promise<DailyProgress> {
    // Get user's schedule settings from membership
    const membership = await prisma.courseMembership.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
        select: {
            schedule: true,
        },
    });

    // Parse schedule to get target minutes (default 30 min)
    const schedule = membership?.schedule as {
        minutesPerSession?: number;
    } | null;
    const targetMinutes = schedule?.minutesPerSession ?? 30;

    // TODO: Calculate actual streak from QuizResponse/study session data
    // For now, return mock data
    const streak = 5;

    // TODO: Calculate actual minutes studied today from QuizResponse timestamps
    // For now, return mock data
    const minutesStudied = 15;

    return {
        streak,
        minutesStudied,
        targetMinutes,
    };
}

/**
 * Get learning history for the graph
 * Returns mastery % and completion % over the last 90 days
 * Supports week, month, and all-time views
 */
async function getLearningHistory(
    _courseId: string,
    _userId: string
): Promise<LearningDataPoint[]> {
    // TODO: Use courseId and userId to fetch actual historical data from InformationPointProgress
    // For now, generate mock historical data for the last 90 days
    // This would require tracking snapshots of progress over time
    // For now, generate mock historical data for the last 90 days

    const history: LearningDataPoint[] = [];
    const today = new Date();
    const totalDays = 90;

    // Generate a realistic learning curve with some variance
    let baseMastery = 15; // Starting point
    let baseCompletion = 5;

    for (let i = totalDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Simulate study days (not every day has progress)
        const isStudyDay = Math.random() > 0.3; // 70% chance of studying

        if (isStudyDay) {
            // Progress on study days
            baseMastery += Math.random() * 1.2 + 0.3;
            baseCompletion += Math.random() * 0.8 + 0.2;
        } else {
            // Slight decay on non-study days
            baseMastery -= Math.random() * 0.3;
        }

        // Add daily variance
        const masteryPercent = Math.min(
            100,
            Math.max(0, Math.round(baseMastery + (Math.random() - 0.5) * 3))
        );
        const completionPercent = Math.min(
            100,
            Math.max(0, Math.round(baseCompletion + (Math.random() - 0.5) * 2))
        );

        history.push({
            date: date.toISOString(),
            masteryPercent,
            completionPercent,
        });
    }

    return history;
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        notFound();
    }

    const session = await auth();
    const { isEnrolled } = await getEnrollmentStatus(
        courseId,
        session?.user?.id ?? null
    );

    // Render different views based on enrollment status
    if (isEnrolled && session?.user?.id) {
        // Fetch all enrolled user data in parallel
        const [lessonStatuses, dailyProgress, learningHistory] =
            await Promise.all([
                getLessonStatuses(courseId, session.user.id),
                getDailyProgress(courseId, session.user.id),
                getLearningHistory(courseId, session.user.id),
            ]);

        return (
            <EnrolledCourseView
                courseId={course.id}
                modules={course.modules}
                lessonStatuses={lessonStatuses}
                dailyProgress={dailyProgress}
                learningHistory={learningHistory}
            />
        );
    }

    return (
        <UnenrolledCourseView
            course={course}
            currentUserId={session?.user?.id ?? null}
        />
    );
}
