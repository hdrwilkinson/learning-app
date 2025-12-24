/**
 * Enrolled User Course Layout
 *
 * Provides the hero header + two-column layout for enrolled user pages.
 * Shows ProgressSidebar with leaderboards, quests, and progress.
 *
 * Note: Child routes like /practice bypass this layout.
 */

import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "../../../../../../../../../services/db/db-client";
import { CourseHero } from "../../_components/CourseHero";
import { ProgressSidebar } from "@/components/ui/layout/ProgressSidebar";
import { auth } from "@/auth";
import { EnrolledCourseMenu } from "./_components/EnrolledCourseMenu";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseId: string; userId: string }>;
}

/**
 * Routes that should bypass the enrolled course layout (hero + sidebar)
 * These routes use their own layout (e.g., FocusLayout for practice mode)
 */
const bypassLayoutRoutes = ["/practice"];

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
        },
    });

    return course;
}

/**
 * Get enrollment data and progress for the user
 */
async function getEnrollmentData(courseId: string, userId: string) {
    const membership = await prisma.courseMembership.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
        select: {
            courseRole: true,
            joinedAt: true,
        },
    });

    if (!membership) {
        return null;
    }

    // TODO: Fetch actual progress data from progress tracking tables
    // For now, return mock progress data
    const progress = {
        completionPercent: 42,
        masteryPercent: 28,
        totalTimeStudiedMinutes: 750,
        memberSince: membership.joinedAt,
    };

    return {
        role: membership.courseRole,
        progress,
    };
}

export default async function EnrolledUserCourseLayout({
    children,
    params,
}: LayoutProps) {
    const { courseId, userId } = await params;

    // Verify the current user matches the URL userId
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        redirect(`/courses/${courseId}`);
    }

    // Check if current route should bypass the layout
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    const shouldBypassLayout = bypassLayoutRoutes.some((route) =>
        pathname.includes(`/courses/${courseId}/user/${userId}${route}`)
    );

    // For routes like /practice, just render children without hero/sidebar
    if (shouldBypassLayout) {
        return <>{children}</>;
    }

    const course = await getCourseForLayout(courseId);

    if (!course) {
        notFound();
    }

    const enrollmentData = await getEnrollmentData(courseId, userId);

    // Must be enrolled to access this layout
    if (!enrollmentData) {
        redirect(`/courses/${courseId}`);
    }

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
                        <EnrolledCourseMenu
                            courseId={course.id}
                            userId={userId}
                            role={enrollmentData.role}
                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout - Main content + Sidebar */}
            <div className="flex justify-center px-4 md:px-6 py-6">
                <div className="flex gap-6 w-full max-w-[1056px] items-start">
                    {/* Main Content Column */}
                    <main className="flex-1 min-w-0 w-full">{children}</main>

                    {/* Sidebar - Progress for enrolled users */}
                    <div className="hidden lg:block sticky top-8 self-start">
                        <ProgressSidebar
                            courseId={course.id}
                            progress={enrollmentData.progress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
