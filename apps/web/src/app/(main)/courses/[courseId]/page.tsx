/**
 * Course Detail Page
 *
 * Displays a course with title, description, stats, and module/lesson structure.
 * Shows different UI based on enrollment status.
 */

import { notFound } from "next/navigation";
import { prisma } from "../../../../../../../services/db/db-client";
import { Badge } from "@/components/ui/shadcn/badge";
import { Accordion } from "@/components/ui/shadcn/accordion";
import { ModuleAccordion } from "@/features/courses";
import type { CourseDetail } from "@/features/courses";
import { auth } from "@/auth";
import { CourseMenu } from "./_components/CourseMenu";
import { ReviewsPreview } from "./_components/ReviewsPreview";
import { HiStar, HiUsers, HiClock, HiCalendar } from "react-icons/hi";

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
        return { isEnrolled: false, role: null };
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
        role: membership?.courseRole ?? null,
    };
}

/**
 * Format hours to a readable string (e.g., "12 hours" or "1.5 hours")
 */
function formatHours(hours: number): string {
    if (hours < 1) {
        return `${Math.round(hours * 60)} min`;
    }
    if (hours === Math.floor(hours)) {
        return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }
    return `${hours.toFixed(1)} hours`;
}

/**
 * Calculate estimated weeks to mastery
 * Assumes 5 hours per week as default study time
 */
function calculateTimeEstimates(
    totalIPs: number,
    minutesPerIP: number,
    hoursPerWeek: number = 5
) {
    if (totalIPs === 0) {
        return {
            totalHours: 0,
            weeksToMastery: 0,
            hoursPerWeek,
        };
    }

    const totalMinutes = totalIPs * minutesPerIP;
    const totalHours = totalMinutes / 60;
    const weeks = totalHours / hoursPerWeek;

    return {
        totalHours,
        weeksToMastery: Math.ceil(weeks),
        hoursPerWeek,
    };
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        notFound();
    }

    const session = await auth();
    const { isEnrolled, role } = await getEnrollmentStatus(
        courseId,
        session?.user?.id ?? null
    );

    const timeEstimates = calculateTimeEstimates(
        course.totalInformationPoints,
        course.estimatedMinutesPerIP
    );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 lg:-mt-2">
            {/* Course header */}
            <div className="mb-8">
                <div className="flex items-start gap-4 mb-2">
                    <h1 className="text-4xl font-display font-bold flex-1">
                        {course.title}
                    </h1>
                    {/* Course menu - top right */}
                    <CourseMenu
                        courseId={course.id}
                        isEnrolled={isEnrolled}
                        role={role}
                        isLoggedIn={!!session?.user}
                    />
                </div>
                {course.topic && (
                    <Badge variant="outline" className="text-xs mb-3">
                        {course.topic}
                    </Badge>
                )}
                {course.description && (
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        {course.description}
                    </p>
                )}
            </div>

            {/* Stats sections */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Competitive stats */}
                <div className="p-6 bg-muted/50 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        Community
                    </h3>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                                <HiUsers className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold font-mono">
                                    {course.memberCount}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {course.memberCount === 1
                                        ? "student enrolled"
                                        : "students enrolled"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-amber-500/10">
                                <HiStar className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                {course.averageRating ? (
                                    <>
                                        <span className="text-2xl font-bold font-mono">
                                            {course.averageRating.toFixed(1)}
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                            {course.ratingCount}{" "}
                                            {course.ratingCount === 1
                                                ? "rating"
                                                : "ratings"}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg font-medium text-muted-foreground">
                                            No ratings yet
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                            Be the first to rate
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time estimates */}
                <div className="p-6 bg-muted/50 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        Time Investment
                    </h3>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-secondary/10">
                                <HiCalendar className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold font-mono">
                                    {timeEstimates.weeksToMastery}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {timeEstimates.weeksToMastery === 1
                                        ? "week to mastery"
                                        : "weeks to mastery"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-accent/10">
                                <HiClock className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold font-mono">
                                    {timeEstimates.hoursPerWeek}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    hours per week
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Based on {formatHours(timeEstimates.totalHours)} total
                        study time
                    </p>
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
                    {course.modules.map((module) => (
                        <ModuleAccordion key={module.id} module={module} />
                    ))}
                </Accordion>
            </div>

            {/* Reviews section */}
            <div className="mt-12">
                <ReviewsPreview
                    courseId={course.id}
                    averageRating={course.averageRating}
                    isEnrolled={isEnrolled}
                    currentUserId={session?.user?.id ?? null}
                />
            </div>
        </div>
    );
}
