"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { HiPlus, HiArrowRight } from "react-icons/hi";

interface CourseMenuProps {
    courseId: string;
    isEnrolled: boolean;
    userId: string | null;
    isLoggedIn: boolean;
}

export function CourseMenu({
    courseId,
    isEnrolled,
    userId,
    isLoggedIn,
}: CourseMenuProps) {
    const [enrolling, setEnrolling] = useState(false);

    // Not logged in - show login button
    if (!isLoggedIn) {
        return (
            <Button asChild className="shrink-0">
                <Link href="/auth/login">
                    <HiPlus className="h-4 w-4" />
                    Sign in to Enroll
                </Link>
            </Button>
        );
    }

    // Enrolled - show "Go to Course" button
    if (isEnrolled && userId) {
        return (
            <Button asChild className="shrink-0">
                <Link href={`/courses/${courseId}/user/${userId}`}>
                    Go to Course
                    <HiArrowRight className="h-4 w-4 ml-1" />
                </Link>
            </Button>
        );
    }

    // Not enrolled - show enroll button
    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const { enrollInCourse } = await import("@/app/actions/courses");
            await enrollInCourse(courseId);
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <Button
            className="shrink-0"
            onClick={handleEnroll}
            disabled={enrolling}
        >
            <HiPlus className="h-4 w-4" />
            {enrolling ? "Enrolling..." : "Enroll"}
        </Button>
    );
}
