"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { LeaveCourseDialog } from "../../_components/LeaveCourseDialog";
import { HiLogout } from "react-icons/hi";

interface DangerZoneProps {
    courseId: string;
}

export function DangerZone({ courseId }: DangerZoneProps) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

    return (
        <>
            <section className="p-6 bg-destructive/5 rounded-lg border border-destructive/20">
                <h2 className="text-lg font-semibold mb-2 text-destructive">
                    Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Once you leave this course, you will be unenrolled. Your
                    progress will be saved and you can re-enroll at any time.
                </p>
                <Button
                    variant="destructive"
                    onClick={() => setLeaveDialogOpen(true)}
                >
                    <HiLogout className="h-4 w-4" />
                    Leave Course
                </Button>
            </section>

            <LeaveCourseDialog
                courseId={courseId}
                open={leaveDialogOpen}
                onOpenChange={setLeaveDialogOpen}
            />
        </>
    );
}
