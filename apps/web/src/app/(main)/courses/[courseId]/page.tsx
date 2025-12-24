/**
 * Course Detail Page (Public View)
 *
 * Displays the public course information for all users.
 * Shows course content accordion and reviews.
 * Enrolled users see "Go to Course" button, unenrolled see "Enroll" button.
 */

import { notFound } from "next/navigation";
import { prisma } from "../../../../../../../services/db/db-client";
import type { CourseDetail } from "@/features/courses";
import { auth } from "@/auth";
import { UnenrolledCourseView } from "./_components/UnenrolledCourseView";

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

export default async function CourseDetailPage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        notFound();
    }

    const session = await auth();

    // Always show the public course view
    // The layout handles showing "Go to Course" vs "Enroll" button based on enrollment
    return (
        <UnenrolledCourseView
            course={course}
            currentUserId={session?.user?.id ?? null}
        />
    );
}
