/**
 * LessonPath
 *
 * Snaking S-curve path visualization for lessons within a module.
 * Nodes alternate left-right as they descend, connected by dotted curved paths.
 */

"use client";

import type { LessonData } from "@/features/courses";
import { LessonNode, type LessonNodeStatus } from "./LessonNode";

interface LessonStatusEntry {
    lessonId: string;
    status: LessonNodeStatus;
}

interface LessonPathProps {
    courseId: string;
    lessons: LessonData[];
    lessonStatuses: LessonStatusEntry[];
}

/**
 * Connector component that draws a curved dotted line between two nodes
 */
function PathConnector({
    fromLeft,
    isCompleted,
}: {
    fromLeft: boolean;
    isCompleted: boolean;
}) {
    // Path coordinates: node centers are at ~8% and ~92% of container width
    // (padding 32px + half node 28px = 60px in ~712px = ~8%)
    // ViewBox 0-100 maps to full container width
    const path = fromLeft
        ? "M 8 0 Q 8 40, 50 40 Q 92 40, 92 80"
        : "M 92 0 Q 92 40, 50 40 Q 8 40, 8 80";

    return (
        <div className="relative h-20 w-full">
            <svg
                viewBox="0 0 100 80"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
            >
                <path
                    d={path}
                    fill="none"
                    stroke={isCompleted ? "#10b981" : "#6b7280"}
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
}

export function LessonPath({
    courseId,
    lessons,
    lessonStatuses,
}: LessonPathProps) {
    const getStatus = (lessonId: string): LessonNodeStatus => {
        const entry = lessonStatuses.find((s) => s.lessonId === lessonId);
        return entry?.status ?? "locked";
    };

    const getAlignment = (index: number): "left" | "right" => {
        return index % 2 === 0 ? "left" : "right";
    };

    return (
        <div className="relative py-4">
            {lessons.map((lesson, index) => {
                const alignment = getAlignment(index);
                const status = getStatus(lesson.id);
                const isLastLesson = index === lessons.length - 1;

                // Check if the path to the next node should be "completed"
                const nextStatus = !isLastLesson
                    ? getStatus(lessons[index + 1].id)
                    : "locked";
                const isPathCompleted =
                    status === "complete" && nextStatus !== "locked";

                return (
                    <div key={lesson.id}>
                        {/* Lesson Node */}
                        <div
                            className={`flex ${
                                alignment === "left"
                                    ? "justify-start pl-4 sm:pl-8"
                                    : "justify-end pr-4 sm:pr-8"
                            }`}
                        >
                            <LessonNode
                                courseId={courseId}
                                lessonId={lesson.id}
                                lessonNumber={lesson.order}
                                title={lesson.title}
                                status={status}
                                alignment={alignment}
                            />
                        </div>

                        {/* Connector to next node (if not last) */}
                        {!isLastLesson && (
                            <PathConnector
                                fromLeft={alignment === "left"}
                                isCompleted={isPathCompleted}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
