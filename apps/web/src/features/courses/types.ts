/**
 * Type definitions for courses feature
 */

export interface CourseListItem {
    id: string;
    title: string;
    description: string | null;
    topic: string | null;
    imageUrl: string | null;
    createdAt: string;
    moduleCount: number;
    lessonCount: number;
}

/**
 * Lesson data for display in accordions.
 * Note: informationPoints count is tracked internally but not displayed to users.
 */
export interface LessonData {
    id: string;
    title: string;
    description: string | null;
    order: number;
    /** Internal count used for time estimates, not displayed directly */
    informationPointCount: number;
}

export interface ModuleData {
    id: string;
    title: string;
    description: string | null;
    order: number;
    lessons: LessonData[];
}

export interface CourseDetail {
    id: string;
    title: string;
    description: string | null;
    topic: string | null;
    imageUrl: string | null;
    createdAt: string;
    modules: ModuleData[];
    // Rating & engagement stats
    averageRating: number | null;
    ratingCount: number;
    memberCount: number;
    // Time estimates
    estimatedMinutesPerIP: number;
    totalInformationPoints: number;
}
