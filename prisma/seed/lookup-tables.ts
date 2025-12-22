/**
 * Lookup table seed data
 * These are referenced by Information Points and define quiz behavior
 */

export const informationPointTypes = [
    {
        name: "definition",
        description:
            "What something means - a clear explanation of a term or concept",
    },
    {
        name: "concept",
        description:
            "How something works or relates - explaining mechanisms, relationships, or principles",
    },
    {
        name: "procedure",
        description:
            "Steps to accomplish something - a sequence of actions or methodology",
    },
    {
        name: "example",
        description:
            "Concrete instance of a concept - illustrative cases that demonstrate ideas",
    },
] as const;

/**
 * Quiz types with their mastery algorithm parameters
 * Based on documentation in apps/web/src/app/docs/reference/database-schema/course-structure/page.mdx
 */
export const quizTypes = [
    {
        name: "binary",
        displayName: "True/False",
        description:
            "Simple binary choice questions testing factual understanding",
        difficultyWeight: 0.5,
        minMasteryToUnlock: 0.0,
        masteryBoostOnCorrect: 0.05,
        stabilityMultiplier: 1.0,
        applicableContentTypes: ["text", "code", "math"],
        requiresLLMGrading: false,
        isActive: true,
    },
    {
        name: "multiple_choice",
        displayName: "Multiple Choice",
        description:
            "Four-option questions with plausible distractors testing recognition and discrimination",
        difficultyWeight: 1.0,
        minMasteryToUnlock: 0.15,
        masteryBoostOnCorrect: 0.1,
        stabilityMultiplier: 1.5,
        applicableContentTypes: ["text", "code", "math"],
        requiresLLMGrading: false,
        isActive: true,
    },
    {
        name: "question_answer",
        displayName: "Q&A",
        description:
            "Open-ended questions requiring written explanation, graded by AI",
        difficultyWeight: 2.0,
        minMasteryToUnlock: 0.4,
        masteryBoostOnCorrect: 0.15,
        stabilityMultiplier: 2.0,
        applicableContentTypes: ["text", "code"],
        requiresLLMGrading: true,
        isActive: true,
    },
] as const;
