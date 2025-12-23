/**
 * Courses Listing Page
 *
 * Displays courses in two sections:
 * - "My Courses" for enrolled courses (if logged in)
 * - "Explore" for browsable courses
 *
 * Server component that fetches courses directly from Prisma.
 * Uses PageLayout for the gamification header and settings.
 */

import { prisma } from "../../../../../../services/db/db-client";
import { auth } from "@/auth";
import { CourseCard } from "@/features/courses";
import type { CourseListItem } from "@/features/courses";
import { PageLayout } from "@/components/ui/layout";

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

async function getEnrolledCourses(userId: string): Promise<CourseListItem[]> {
    const memberships = await prisma.courseMembership.findMany({
        where: {
            userId,
            course: {
                visibility: "PUBLIC",
                generationStatus: "COMPLETED",
            },
        },
        orderBy: { joinedAt: "desc" },
        select: {
            course: {
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
            },
        },
    });

    return memberships.map(({ course }) => ({
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
    const session = await auth();
    const userId = session?.user?.id;

    // Fetch all courses and enrolled courses in parallel
    const [allCourses, enrolledCourses] = await Promise.all([
        getCourses(),
        userId ? getEnrolledCourses(userId) : Promise.resolve([]),
    ]);

    // Create a set of enrolled course IDs for filtering
    const enrolledIds = new Set(enrolledCourses.map((c) => c.id));

    // Filter out enrolled courses from explore list
    const exploreCourses = allCourses.filter((c) => !enrolledIds.has(c.id));

    const hasEnrolledCourses = enrolledCourses.length > 0;

    return (
        <PageLayout>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        Courses
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Explore structured learning paths and master new
                        subjects.
                    </p>
                </div>

                {/* My Courses Section - only shown if logged in and has enrollments */}
                {hasEnrolledCourses && (
                    <section className="mb-12">
                        <div className="mb-4">
                            <h2 className="text-2xl font-display font-semibold">
                                My Courses
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Continue where you left off
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Explore Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-display font-semibold">
                            Explore
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Discover new courses to learn
                        </p>
                    </div>
                    {exploreCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {hasEnrolledCourses
                                    ? "You're enrolled in all available courses!"
                                    : "No courses available yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exploreCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PageLayout>
    );
}
