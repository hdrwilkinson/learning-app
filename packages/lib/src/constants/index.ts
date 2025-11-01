/**
 * Shared constants
 */

export const APP_NAME = "Learning App";
export const APP_DESCRIPTION = "GenAI-powered learning platform";

// Quiz difficulty levels
export enum QuizDifficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

// Question types
export enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    TRUE_FALSE = "TRUE_FALSE",
    SHORT_ANSWER = "SHORT_ANSWER",
}

// Learning modes
export enum LearningMode {
    CURIOSITY = "CURIOSITY",
    QUIZ = "QUIZ",
    EXPLORATION = "EXPLORATION",
}

// Progress status
export enum ProgressStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    MASTERED = "MASTERED",
}
