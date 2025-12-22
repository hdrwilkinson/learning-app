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

export interface InformationPointData {
    id: string;
    title: string;
    content: string;
    order: number;
    type: string | null;
}

export interface LessonData {
    id: string;
    title: string;
    description: string | null;
    order: number;
    informationPoints: InformationPointData[];
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
}
