/**
 * LessonItem Component
 *
 * Displays a lesson as a simple item (not expandable).
 * Shows lesson title and description.
 */

"use client";

import type { LessonData } from "../../../types";

interface LessonItemProps {
    lesson: LessonData;
    moduleOrder: number;
}

export function LessonItem({ lesson, moduleOrder }: LessonItemProps) {
    return (
        <div className="border-l-2 border-muted pl-4 ml-4 py-2">
            <div className="flex items-start gap-3">
                <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5">
                    {moduleOrder}.{lesson.order}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium">{lesson.title}</span>
                    {lesson.description && (
                        <span className="text-sm text-muted-foreground line-clamp-2">
                            {lesson.description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
