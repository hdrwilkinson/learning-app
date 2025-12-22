/**
 * Course Detail Page
 *
 * Displays a course with its full hierarchy:
 * modules, lessons, and information points in accordions.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../../../../services/db/db-client";
import { Badge } from "@/components/ui/shadcn/badge";
import { Accordion } from "@/components/ui/shadcn/accordion";
import { ModuleAccordion } from "@/features/courses";
import type { CourseDetail } from "@/features/courses";
import { HiArrowLeft } from "react-icons/hi";

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
        return null;
    }

    return {
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
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        notFound();
    }

    // Calculate stats
    const totalLessons = course.modules.reduce(
        (sum, m) => sum + m.lessons.length,
        0
    );
    const totalIPs = course.modules.reduce(
        (sum, m) =>
            sum +
            m.lessons.reduce((lSum, l) => lSum + l.informationPoints.length, 0),
        0
    );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Back link */}
            <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <HiArrowLeft className="h-4 w-4" />
                <span>Back to Courses</span>
            </Link>

            {/* Course header */}
            <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                    <h1 className="text-4xl font-display font-bold flex-1">
                        {course.title}
                    </h1>
                    {course.topic && (
                        <Badge
                            variant="secondary"
                            className="text-base px-3 py-1"
                        >
                            {course.topic}
                        </Badge>
                    )}
                </div>
                {course.description && (
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        {course.description}
                    </p>
                )}
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono text-primary">
                        {course.modules.length}
                    </span>
                    <span className="text-muted-foreground">
                        {course.modules.length === 1 ? "Module" : "Modules"}
                    </span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono text-primary">
                        {totalLessons}
                    </span>
                    <span className="text-muted-foreground">
                        {totalLessons === 1 ? "Lesson" : "Lessons"}
                    </span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono text-primary">
                        {totalIPs}
                    </span>
                    <span className="text-muted-foreground">
                        Information Points
                    </span>
                </div>
            </div>

            {/* Modules accordion */}
            <div className="space-y-4">
                <h2 className="text-2xl font-display font-semibold">
                    Course Content
                </h2>
                <Accordion
                    type="multiple"
                    defaultValue={[`module-${course.modules[0]?.id}`]}
                    className="space-y-4"
                >
                    {course.modules.map((module, index) => (
                        <ModuleAccordion
                            key={module.id}
                            module={module}
                            defaultOpen={index === 0}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
