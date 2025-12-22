/**
 * Courses Listing Page
 *
 * Displays a grid of available courses.
 * Server component that fetches courses directly from Prisma.
 */

import { prisma } from "../../../../../../services/db/db-client";
import { CourseCard } from "@/features/courses";
import type { CourseListItem } from "@/features/courses";

async function getCourses(): Promise<CourseListItem[]> {
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

    return courses.map((course) => ({
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
}

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2">
                    Courses
                </h1>
                <p className="text-lg text-muted-foreground">
                    Explore structured learning paths and master new subjects.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        No courses available yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
