/**
 * Shared Types for Chat Agents
 *
 * Defines the common types used across all chat agents including
 * modes, contexts, and option schemas.
 */

import { z } from "zod";

/**
 * Available chat modes corresponding to learning interaction modes.
 * @see docs/features/specifications/learning-interaction-modes.md
 */
export type ChatMode = "learn" | "quiz" | "curiosity" | "reflection";

/**
 * Base context shared across all chat modes.
 */
export interface BaseContext {
    courseId?: string;
    lessonId?: string;
    informationPointId?: string;
}

/**
 * Learn mode context - for introducing Information Points.
 */
export interface LearnContext extends BaseContext {
    courseId: string;
    lessonId: string;
    informationPointId: string;
    ipTitle: string;
    ipContent: string;
    lessonTitle: string;
    lessonDescription?: string;
    prerequisites?: string[];
}

/**
 * Quiz mode context - for testing knowledge.
 */
export interface QuizContext extends BaseContext {
    courseId: string;
    lessonId: string;
    quizSessionId: string;
    questionId?: string;
    questionText?: string;
    questionType?: "binary" | "multiple_choice" | "question_answer";
    informationPointId?: string;
    ipTitle?: string;
}

/**
 * Curiosity mode context - for free-form exploration.
 */
export interface CuriosityContext extends BaseContext {
    /** If set, curiosity is scoped to this course */
    courseId?: string;
    courseTitle?: string;
    courseDescription?: string;
    /** Topics already covered in the course */
    completedTopics?: string[];
    /** Current progress percentage */
    progress?: number;
}

/**
 * Reflection mode context - for understanding after wrong answers.
 */
export interface ReflectionContext extends BaseContext {
    courseId: string;
    lessonId: string;
    informationPointId: string;
    questionId: string;
    questionText: string;
    userAnswer?: string;
    correctAnswer: string;
    ipTitle: string;
    ipContent: string;
    prerequisites?: string[];
}

// =============================================================================
// Zod Schemas for Agent Call Options
// =============================================================================

/**
 * Schema for Learn mode call options.
 */
export const learnOptionsSchema = z.object({
    courseId: z.string(),
    lessonId: z.string(),
    informationPointId: z.string(),
    ipTitle: z.string(),
    ipContent: z.string(),
    lessonTitle: z.string(),
    lessonDescription: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
});

export type LearnOptions = z.infer<typeof learnOptionsSchema>;

/**
 * Schema for Quiz mode call options.
 */
export const quizOptionsSchema = z.object({
    courseId: z.string(),
    lessonId: z.string(),
    quizSessionId: z.string(),
    questionId: z.string().optional(),
    questionText: z.string().optional(),
    questionType: z
        .enum(["binary", "multiple_choice", "question_answer"])
        .optional(),
    informationPointId: z.string().optional(),
    ipTitle: z.string().optional(),
});

export type QuizOptions = z.infer<typeof quizOptionsSchema>;

/**
 * Schema for Curiosity mode call options.
 */
export const curiosityOptionsSchema = z.object({
    courseId: z.string().optional(),
    courseTitle: z.string().optional(),
    courseDescription: z.string().optional(),
    completedTopics: z.array(z.string()).optional(),
    progress: z.number().optional(),
});

export type CuriosityOptions = z.infer<typeof curiosityOptionsSchema>;

/**
 * Schema for Reflection mode call options.
 */
export const reflectionOptionsSchema = z.object({
    courseId: z.string(),
    lessonId: z.string(),
    informationPointId: z.string(),
    questionId: z.string(),
    questionText: z.string(),
    userAnswer: z.string().optional(),
    correctAnswer: z.string(),
    ipTitle: z.string(),
    ipContent: z.string(),
    prerequisites: z.array(z.string()).optional(),
});

export type ReflectionOptions = z.infer<typeof reflectionOptionsSchema>;

/**
 * Union type of all agent options.
 */
export type AgentOptions =
    | LearnOptions
    | QuizOptions
    | CuriosityOptions
    | ReflectionOptions;

/**
 * Map of mode to its options type.
 */
export interface AgentOptionsMap {
    learn: LearnOptions;
    quiz: QuizOptions;
    curiosity: CuriosityOptions;
    reflection: ReflectionOptions;
}
