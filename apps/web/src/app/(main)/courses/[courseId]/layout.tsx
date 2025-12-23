/**
 * Course Detail Layout
 *
 * Provides the hero header + two-column layout for course detail pages.
 * Fetches minimal course data for the hero and renders children in the main column.
 */

import { notFound } from "next/navigation";
import { prisma } from "../../../../../../../services/db/db-client";
import { CourseHero } from "./_components/CourseHero";
import { AccessorySection } from "@/components/ui/layout/AccessorySection";
import { auth } from "@/auth";
import { CourseMenu } from "./_components/CourseMenu";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}

/**
 * Fetch minimal course data needed for the hero
 */
async function getCourseForHero(courseId: string) {
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
        },
    });

    return course;
}

/**
 * Get enrollment status for the course menu
 */
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

export default async function CourseDetailLayout({
    children,
    params,
}: LayoutProps) {
    const { courseId } = await params;
    const course = await getCourseForHero(courseId);

    if (!course) {
        notFound();
    }

    const session = await auth();
    const { isEnrolled, role } = await getEnrollmentStatus(
        courseId,
        session?.user?.id ?? null
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
                            role={role}
                            isLoggedIn={!!session?.user}
                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout - Main content + Accessory */}
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

                    {/* Accessory Section - Desktop only, sticky */}
                    <div className="hidden lg:block sticky top-8 self-start">
                        <AccessorySection />
                    </div>
                </div>
            </div>
        </div>
    );
}
