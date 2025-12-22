/**
 * Courses API Route
 *
 * Handles listing courses.
 * GET - List all public courses with module/lesson counts
 */

import { NextResponse } from "next/server";
import { prisma } from "../../../../../../services/db/db-client";

/**
 * GET /api/courses
 *
 * List all public courses with counts.
 */
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: {
                visibility: "PUBLIC",
                generationStatus: "COMPLETED",
            },
            select: {
                id: true,
                title: true,
                description: true,
                topic: true,
                imageUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        modules: true,
                    },
                },
                modules: {
                    select: {
                        _count: {
                            select: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Transform to include total lesson count
        const coursesWithCounts = courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            topic: course.topic,
            imageUrl: course.imageUrl,
            createdAt: course.createdAt.toISOString(),
            moduleCount: course._count.modules,
            lessonCount: course.modules.reduce(
                (sum, m) => sum + m._count.lessons,
                0
            ),
        }));

        return NextResponse.json({ courses: coursesWithCounts });
    } catch (error) {
        console.error("GET /api/courses error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
