/**
 * Course Detail Layout (Public View)
 *
 * Provides the hero header + two-column layout for the public course page.
 * Always shows CourseInfoSidebar with community stats and time investment.
 * The CourseMenu shows "Enroll" or "Go to Course" based on enrollment status.
 *
 * Note: Child routes like /practice use FocusLayout and bypass this layout's
 * hero/sidebar by passing children through directly.
 */

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "../../../../../../../services/db/db-client";
import { CourseHero } from "./_components/CourseHero";
import { CourseInfoSidebar } from "@/components/ui/layout/CourseInfoSidebar";
import { auth } from "@/auth";
import { CourseMenu } from "./_components/CourseMenu";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}

/**
 * Routes that should bypass the course detail layout (hero + sidebar)
 * These routes use their own layout (e.g., FocusLayout for practice mode)
 */
const bypassLayoutRoutes = ["/practice", "/user/"];

/**
 * Fetch course data needed for the layout (hero + sidebar)
 */
async function getCourseForLayout(courseId: string) {
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            visibility: "PUBLIC",
            generationStatus: "COMPLETED",
        },
        select: {
            id: true,
            title: true,
            topic: true,
            imageUrl: true,
            description: true,
            averageRating: true,
            ratingCount: true,
            estimatedMinutesPerIP: true,
            _count: {
                select: { memberships: true },
            },
            modules: {
                select: {
                    lessons: {
                        select: {
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
        topic: course.topic,
        imageUrl: course.imageUrl,
        description: course.description,
        averageRating: course.averageRating,
        ratingCount: course.ratingCount,
        memberCount: course._count.memberships,
        estimatedMinutesPerIP: course.estimatedMinutesPerIP,
        totalInformationPoints,
    };
}

/**
 * Get enrollment status for the current user
 */
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
 * Calculate time estimates for the sidebar
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

export default async function CourseDetailLayout({
    children,
    params,
}: LayoutProps) {
    const { courseId } = await params;

    // Check if current route should bypass the course detail layout
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    const shouldBypassLayout = bypassLayoutRoutes.some((route) =>
        pathname.includes(`/courses/${courseId}${route}`)
    );

    // For routes like /practice or /user/[userId], just render children without hero/sidebar
    if (shouldBypassLayout) {
        return <>{children}</>;
    }

    const course = await getCourseForLayout(courseId);

    if (!course) {
        notFound();
    }

    const session = await auth();
    const { isEnrolled } = await getEnrollmentStatus(
        courseId,
        session?.user?.id ?? null
    );

    const timeEstimates = calculateTimeEstimates(
        course.totalInformationPoints,
        course.estimatedMinutesPerIP
    );

    return (
        <div className="w-full">
            {/* Hero Section - Full width of content area */}
            <div className="px-4 md:px-6 pt-4 lg:pt-8">
                <div className="max-w-[1056px] mx-auto relative">
                    <CourseHero
                        title={course.title}
                        topic={course.topic}
                        imageUrl={course.imageUrl}
                    />
                    {/* Course Menu - positioned on the hero */}
                    <div className="absolute top-4 right-4 z-10">
                        <CourseMenu
                            courseId={course.id}
                            isEnrolled={isEnrolled}
                            userId={session?.user?.id ?? null}
                            isLoggedIn={!!session?.user}
                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout - Main content + Sidebar */}
            <div className="flex justify-center px-4 md:px-6 py-6">
                <div className="flex gap-6 w-full max-w-[1056px] items-start">
                    {/* Main Content Column */}
                    <main className="flex-1 min-w-0 w-full">
                        {/* Description below hero */}
                        {course.description && (
                            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
                                {course.description}
                            </p>
                        )}
                        {children}
                    </main>

                    {/* Sidebar - Always show CourseInfoSidebar on public page */}
                    <div className="hidden lg:block sticky top-8 self-start">
                        <CourseInfoSidebar
                            memberCount={course.memberCount}
                            averageRating={course.averageRating}
                            ratingCount={course.ratingCount}
                            weeksToMastery={timeEstimates.weeksToMastery}
                            hoursPerWeek={timeEstimates.hoursPerWeek}
                            totalHours={timeEstimates.totalHours}
                            courseId={course.id}
                            isLoggedIn={!!session?.user}
                            isEnrolled={isEnrolled}
                            userId={session?.user?.id ?? null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
