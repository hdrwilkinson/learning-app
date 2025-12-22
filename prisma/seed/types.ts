/**
 * Type definitions for seed data structures
 */

export type InformationPointTypeName =
    | "definition"
    | "concept"
    | "procedure"
    | "example";

export type QuizTypeName = "binary" | "multiple_choice" | "question_answer";

export interface SeedInformationPoint {
    title: string;
    type: InformationPointTypeName;
    content: string;
    order: number;
    quizTypes: QuizTypeName[];
}

export interface SeedLesson {
    title: string;
    description: string;
    order: number;
    informationPoints: SeedInformationPoint[];
}

export interface SeedModule {
    title: string;
    description: string;
    order: number;
    lessons: SeedLesson[];
}

export interface SeedCourse {
    title: string;
    description: string;
    topic: string;
    modules: SeedModule[];
}
