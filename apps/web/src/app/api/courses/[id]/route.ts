/**
 * Course Detail API Route
 *
 * Handles fetching a single course with full hierarchy.
 * GET - Get course with modules, lessons, and information points
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../services/db/db-client";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/courses/[id]
 *
 * Get a single course with full hierarchy.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const course = await prisma.course.findFirst({
            where: {
                id,
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
                                informationPoints: {
                                    orderBy: { order: "asc" },
                                    include: {
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Transform to a cleaner format
        const courseData = {
            id: course.id,
            title: course.title,
            description: course.description,
            topic: course.topic,
            imageUrl: course.imageUrl,
            createdAt: course.createdAt.toISOString(),
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
                    informationPoints: lesson.informationPoints.map((ip) => ({
                        id: ip.id,
                        title: ip.title,
                        content: ip.content,
                        order: ip.order,
                        type: ip.type?.name ?? null,
                    })),
                })),
            })),
        };

        return NextResponse.json(courseData);
    } catch (error) {
        console.error("GET /api/courses/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
