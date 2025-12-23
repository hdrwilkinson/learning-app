/**
 * EnrolledCourseView
 *
 * Displays the learning dashboard for enrolled users.
 * Includes practice button, study modes, and the snaking lesson path.
 */

"use client";

import { useState } from "react";
import type { ModuleData } from "@/features/courses";
import { PracticeButton } from "./PracticeButton";
import { StudyModesGrid } from "./StudyModesGrid";
import { ModulePagination } from "./ModulePagination";
import { LessonPath } from "./LessonPath";

export interface LessonStatus {
    lessonId: string;
    status: "complete" | "current" | "locked";
}

interface EnrolledCourseViewProps {
    courseId: string;
    modules: ModuleData[];
    lessonStatuses: LessonStatus[];
}

export function EnrolledCourseView({
    courseId,
    modules,
    lessonStatuses,
}: EnrolledCourseViewProps) {
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const currentModule = modules[currentModuleIndex];

    // Get lesson statuses for the current module
    const currentModuleLessonStatuses =
        currentModule?.lessons.map((lesson) => {
            const status = lessonStatuses.find((s) => s.lessonId === lesson.id);
            return {
                lessonId: lesson.id,
                status: status?.status ?? "locked",
            };
        }) ?? [];

    const handlePrevModule = () => {
        setCurrentModuleIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNextModule = () => {
        setCurrentModuleIndex((prev) => Math.min(modules.length - 1, prev + 1));
    };

    return (
        <div className="w-full pb-8 space-y-6">
            {/* Practice Now Button */}
            <PracticeButton courseId={courseId} />

            {/* Study Modes Grid */}
            <StudyModesGrid courseId={courseId} />

            {/* Module Navigation and Lesson Path */}
            <div className="space-y-4">
                <ModulePagination
                    currentIndex={currentModuleIndex}
                    totalModules={modules.length}
                    moduleTitle={currentModule?.title ?? ""}
                    onPrev={handlePrevModule}
                    onNext={handleNextModule}
                />

                {currentModule && (
                    <LessonPath
                        courseId={courseId}
                        lessons={currentModule.lessons}
                        lessonStatuses={currentModuleLessonStatuses}
                    />
                )}
            </div>
        </div>
    );
}
