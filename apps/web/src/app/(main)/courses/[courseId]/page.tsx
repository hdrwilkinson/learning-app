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
} from "./_components/EnrolledCourseView";

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
        const lessonStatuses = await getLessonStatuses(
            courseId,
            session.user.id
        );

        return (
            <EnrolledCourseView
                courseId={course.id}
                modules={course.modules}
                lessonStatuses={lessonStatuses}
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
