/**
 * Shared TypeScript types
 */

// API Response wrapper
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// Learning domain types
export interface InformationPoint {
    id: string;
    content: string;
    lessonId: string;
    order: number;
}

export interface Lesson {
    id: string;
    title: string;
    moduleId: string;
    order: number;
    informationPoints?: InformationPoint[];
}

export interface Module {
    id: string;
    title: string;
    courseId: string;
    order: number;
    lessons?: Lesson[];
}
