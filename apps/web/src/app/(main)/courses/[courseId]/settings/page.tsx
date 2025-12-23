/**
 * Course Settings Page
 *
 * Allows enrolled users to manage their course preferences:
 * - Study schedule
 * - Notification preferences
 * - Privacy settings
 * - Leave course option
 */

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../../../../../services/db/db-client";
import { auth } from "@/auth";
import { HiArrowLeft } from "react-icons/hi";
import { ScheduleSection } from "./_components/ScheduleSection";
import { NotificationsSection } from "./_components/NotificationsSection";
import { PrivacySection } from "./_components/PrivacySection";
import { DangerZone } from "./_components/DangerZone";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

async function getCourseAndMembership(courseId: string, userId: string) {
    const [course, membership] = await Promise.all([
        prisma.course.findFirst({
            where: {
                id: courseId,
                visibility: "PUBLIC",
                generationStatus: "COMPLETED",
            },
            select: {
                id: true,
                title: true,
            },
        }),
        prisma.courseMembership.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            select: {
                courseRole: true,
                schedule: true,
                emailReminders: true,
                pushNotifications: true,
                weeklyProgressEmail: true,
                showProgressToGroup: true,
                appearInLeaderboards: true,
            },
        }),
    ]);

    return { course, membership };
}

export default async function CourseSettingsPage({ params }: PageProps) {
    const { courseId } = await params;
    const session = await auth();

    // Must be logged in
    if (!session?.user?.id) {
        redirect(`/auth/login?callbackUrl=/courses/${courseId}/settings`);
    }

    const { course, membership } = await getCourseAndMembership(
        courseId,
        session.user.id
    );

    // Course must exist
    if (!course) {
        notFound();
    }

    // Must be enrolled
    if (!membership) {
        redirect(`/courses/${courseId}`);
    }

    const settings = {
        schedule: membership.schedule as {
            daysPerWeek: string[];
            minutesPerSession: number;
        } | null,
        emailReminders: membership.emailReminders,
        pushNotifications: membership.pushNotifications,
        weeklyProgressEmail: membership.weeklyProgressEmail,
        showProgressToGroup: membership.showProgressToGroup,
        appearInLeaderboards: membership.appearInLeaderboards,
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 lg:-mt-2">
            {/* Back link */}
            <Link
                href={`/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <HiArrowLeft className="h-4 w-4" />
                <span>Back to Course</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold mb-2">
                    Course Settings
                </h1>
                <p className="text-muted-foreground">{course.title}</p>
            </div>

            {/* Settings sections */}
            <div className="space-y-8 max-w-2xl">
                <ScheduleSection
                    courseId={courseId}
                    schedule={settings.schedule}
                />

                <NotificationsSection
                    courseId={courseId}
                    emailReminders={settings.emailReminders}
                    pushNotifications={settings.pushNotifications}
                    weeklyProgressEmail={settings.weeklyProgressEmail}
                />

                <PrivacySection
                    courseId={courseId}
                    showProgressToGroup={settings.showProgressToGroup}
                    appearInLeaderboards={settings.appearInLeaderboards}
                />

                {membership.courseRole !== "CREATOR" && (
                    <DangerZone courseId={courseId} />
                )}
            </div>
        </div>
    );
}
