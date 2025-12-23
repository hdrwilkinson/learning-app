"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { leaveCourse } from "@/app/actions/courses";
import { HiExclamation } from "react-icons/hi";

interface LeaveCourseDialogProps {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeaveCourseDialog({
    courseId,
    open,
    onOpenChange,
}: LeaveCourseDialogProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleLeave = () => {
        setError(null);
        startTransition(async () => {
            const result = await leaveCourse(courseId);
            if (result.error) {
                setError(result.error);
            } else {
                onOpenChange(false);
                router.push("/courses");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave this course?</DialogTitle>
                    <DialogDescription>
                        You will be unenrolled from this course. Your progress
                        will be saved and you can re-enroll at any time.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                        <HiExclamation className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleLeave}
                        disabled={isPending}
                    >
                        {isPending ? "Leaving..." : "Leave Course"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
