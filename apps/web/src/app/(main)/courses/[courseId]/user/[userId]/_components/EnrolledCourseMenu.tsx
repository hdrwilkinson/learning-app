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
import { HiDotsVertical, HiCog, HiLogout, HiStar } from "react-icons/hi";
import { LeaveCourseDialog } from "../../../_components/LeaveCourseDialog";

interface EnrolledCourseMenuProps {
    courseId: string;
    userId: string;
    role: string | null;
}

export function EnrolledCourseMenu({
    courseId,
    userId,
    role,
}: EnrolledCourseMenuProps) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

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
                            href={`/courses/${courseId}/reviews`}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <HiStar className="h-4 w-4" />
                            Reviews
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/courses/${courseId}/user/${userId}/settings`}
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
