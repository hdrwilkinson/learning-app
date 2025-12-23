/**
 * EnrolledCourseView
 *
 * Displays the learning dashboard for enrolled users.
 * Includes stats header with practice button and daily progress,
 * learning graph, study modes, and the snaking lesson path.
 */

"use client";

import { useState } from "react";
import type { ModuleData } from "@/features/courses";
import { StatsHeader } from "./StatsHeader";
import { LearningGraph, type LearningDataPoint } from "./LearningGraph";
import { StudyModesGrid } from "./StudyModesGrid";
import { ModulePagination } from "./ModulePagination";
import { LessonPath } from "./LessonPath";

export interface LessonStatus {
    lessonId: string;
    status: "complete" | "current" | "locked";
}

export interface DailyProgress {
    streak: number;
    minutesStudied: number;
    targetMinutes: number;
}

interface EnrolledCourseViewProps {
    courseId: string;
    modules: ModuleData[];
    lessonStatuses: LessonStatus[];
    dailyProgress: DailyProgress;
    learningHistory: LearningDataPoint[];
}

export function EnrolledCourseView({
    courseId,
    modules,
    lessonStatuses,
    dailyProgress,
    learningHistory,
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
            {/* Stats Header: Practice Button + Daily Progress */}
            <StatsHeader
                courseId={courseId}
                streak={dailyProgress.streak}
                minutesStudied={dailyProgress.minutesStudied}
                targetMinutes={dailyProgress.targetMinutes}
            />

            {/* Learning Graph: Mastery + Completion over time */}
            <LearningGraph data={learningHistory} />

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
