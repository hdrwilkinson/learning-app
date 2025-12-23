"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { HiDotsVertical, HiCog, HiLogout, HiPlus } from "react-icons/hi";
import { LeaveCourseDialog } from "./LeaveCourseDialog";

interface CourseMenuProps {
    courseId: string;
    isEnrolled: boolean;
    role: string | null;
    isLoggedIn: boolean;
}

export function CourseMenu({
    courseId,
    isEnrolled,
    role,
    isLoggedIn,
}: CourseMenuProps) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
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

    // Not enrolled - show enroll button
    if (!isEnrolled) {
        const handleEnroll = async () => {
            setEnrolling(true);
            try {
                const { enrollInCourse } =
                    await import("@/app/actions/courses");
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

    // Enrolled - show three-dot menu
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <HiDotsVertical className="h-5 w-5" />
                        <span className="sr-only">Course options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/courses/${courseId}/settings`}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <HiCog className="h-4 w-4" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    {role !== "CREATOR" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onSelect={() => setLeaveDialogOpen(true)}
                            >
                                <HiLogout className="h-4 w-4" />
                                Leave Course
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <LeaveCourseDialog
                courseId={courseId}
                open={leaveDialogOpen}
                onOpenChange={setLeaveDialogOpen}
            />
        </>
    );
}
