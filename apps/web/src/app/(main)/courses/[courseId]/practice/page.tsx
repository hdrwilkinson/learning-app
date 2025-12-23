/**
 * Practice Page
 *
 * Entry point for practice/learn mode. Fetches the next unseen
 * information points and renders the practice session.
 *
 * Server Component that:
 * 1. Verifies user is authenticated and enrolled
 * 2. Fetches next 3 unseen IPs in order
 * 3. Renders the PracticeSession client component
 */

import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getNextUnseenIPs } from "@/app/actions/learning";
import { PracticeSession } from "@/features/learning";
import { prisma } from "../../../../../../../../services/db/db-client";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

/**
 * Verify course exists and user is enrolled.
 */
async function verifyCourseAccess(courseId: string, userId: string) {
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            visibility: "PUBLIC",
            generationStatus: "COMPLETED",
        },
        select: { id: true, title: true },
    });

    if (!course) {
        return { error: "course_not_found" as const };
    }

    const membership = await prisma.courseMembership.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });

    if (!membership) {
        return { error: "not_enrolled" as const };
    }

    return { course };
}

export default async function PracticePage({ params }: PageProps) {
    const { courseId } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
        redirect(`/auth/login?callbackUrl=/courses/${courseId}/practice`);
    }

    // Verify access
    const access = await verifyCourseAccess(courseId, session.user.id);
    if ("error" in access) {
        if (access.error === "course_not_found") {
            notFound();
        }
        // Not enrolled - redirect to course page
        redirect(`/courses/${courseId}`);
    }

    // Fetch next 3 unseen IPs
    const result = await getNextUnseenIPs(courseId, 3);

    if ("error" in result) {
        // Handle error - could show error page, but for now redirect
        redirect(`/courses/${courseId}`);
    }

    return <PracticeSession courseId={courseId} initialIPs={result.ips} />;
}
