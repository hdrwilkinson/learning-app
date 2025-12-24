/**
 * Enrolled User Course Page
 *
 * Displays the learning dashboard for enrolled users.
 * Requires the user to be enrolled in the course.
 * Shows stats, learning graph, study modes, and lesson path.
 */

import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../../../../../../services/db/db-client";
import { auth } from "@/auth";
import { EnrolledCourseView } from "./_components/EnrolledCourseView";
import type {
    LessonStatus,
    DailyProgress,
} from "./_components/EnrolledCourseView";
import type { LearningDataPoint } from "./_components/LearningGraph";
import type { ModuleData } from "@/features/courses";

interface PageProps {
    params: Promise<{ courseId: string; userId: string }>;
}

/**
 * Get course modules for the enrolled user view
 */
async function getCourseModules(
    courseId: string
): Promise<ModuleData[] | null> {
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
        },
    });

    if (!course) {
        return null;
    }

    return course.modules.map((module) => ({
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
    }));
}

/**
 * Verify user is enrolled in the course
 */
async function verifyEnrollment(courseId: string, userId: string) {
    const membership = await prisma.courseMembership.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
        select: { courseRole: true },
    });

    return !!membership;
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

export default async function EnrolledUserCoursePage({ params }: PageProps) {
    const { courseId, userId } = await params;

    // Verify the current user matches the URL userId
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        redirect(`/courses/${courseId}`);
    }

    // Verify enrollment
    const isEnrolled = await verifyEnrollment(courseId, userId);
    if (!isEnrolled) {
        redirect(`/courses/${courseId}`);
    }

    // Get course modules
    const modules = await getCourseModules(courseId);
    if (!modules) {
        notFound();
    }

    // Fetch all enrolled user data in parallel
    const [lessonStatuses, dailyProgress, learningHistory] = await Promise.all([
        getLessonStatuses(courseId, userId),
        getDailyProgress(courseId, userId),
        getLearningHistory(courseId, userId),
    ]);

    return (
        <EnrolledCourseView
            courseId={courseId}
            userId={userId}
            modules={modules}
            lessonStatuses={lessonStatuses}
            dailyProgress={dailyProgress}
            learningHistory={learningHistory}
        />
    );
}
