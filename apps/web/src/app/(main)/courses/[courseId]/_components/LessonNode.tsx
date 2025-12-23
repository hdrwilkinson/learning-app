/**
 * LessonNode
 *
 * Individual node in the snaking lesson path.
 */

import Link from "next/link";
import { HiCheck, HiLockClosed } from "react-icons/hi";
import { cn } from "@/lib/utils";

export type LessonNodeStatus = "complete" | "current" | "locked";

interface LessonNodeProps {
    courseId: string;
    lessonId: string;
    lessonNumber: number;
    title: string;
    status: LessonNodeStatus;
    alignment: "left" | "right";
}

export function LessonNode({
    courseId,
    lessonId,
    lessonNumber,
    title,
    status,
    alignment,
}: LessonNodeProps) {
    const isInteractive = status !== "locked";

    const nodeContent = (
        <div
            className={cn(
                "flex items-center gap-4",
                alignment === "right" && "flex-row-reverse"
            )}
        >
            {/* Node circle container - fixed size to prevent layout shift */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                {/* Actual node circle - scales on hover without affecting layout */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-full border-4 transition-all duration-200",
                        "group-hover:scale-110 group-hover:-m-1",
                        status === "complete" &&
                            "border-emerald-500 bg-emerald-500 text-white",
                        status === "current" &&
                            "border-primary bg-primary text-white ring-4 ring-primary/20",
                        status === "locked" &&
                            "border-muted bg-muted text-muted-foreground"
                    )}
                >
                    {status === "complete" ? (
                        <HiCheck className="h-6 w-6" />
                    ) : status === "locked" ? (
                        <HiLockClosed className="h-5 w-5" />
                    ) : (
                        <span className="text-lg font-bold">
                            {lessonNumber}
                        </span>
                    )}
                </div>

                {/* Current indicator pulse */}
                {status === "current" && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                )}
            </div>

            {/* Lesson info */}
            <div
                className={cn("min-w-0", alignment === "right" && "text-right")}
            >
                <p
                    className={cn(
                        "text-xs font-medium uppercase tracking-wide",
                        status === "complete" && "text-emerald-600",
                        status === "current" && "text-primary",
                        status === "locked" && "text-muted-foreground"
                    )}
                >
                    Lesson {lessonNumber}
                </p>
                <h4
                    className={cn(
                        "font-semibold truncate max-w-[200px]",
                        status === "locked"
                            ? "text-muted-foreground"
                            : "text-foreground"
                    )}
                >
                    {title}
                </h4>
            </div>
        </div>
    );

    if (isInteractive) {
        return (
            <Link
                href={`/courses/${courseId}/lessons/${lessonId}`}
                className="block group"
            >
                {nodeContent}
            </Link>
        );
    }

    return <div className="opacity-60 cursor-not-allowed">{nodeContent}</div>;
}
