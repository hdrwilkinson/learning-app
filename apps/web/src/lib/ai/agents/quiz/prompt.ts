/**
 * Quiz Mode System Prompt
 *
 * Builds the system prompt for Quiz mode based on context.
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import type { QuizOptions } from "../types";

/**
 * Base prompt defining the Quiz mode AI behavior.
 */
const BASE_PROMPT = `You are a supportive quiz assistant helping test and reinforce knowledge.
Your role is to present questions, evaluate answers, and provide helpful feedback.

Guidelines:
- Present questions clearly and concisely
- Wait for the user to provide their answer before giving feedback
- Evaluate their response and provide encouraging feedback regardless of correctness
- For wrong answers, offer to help them understand (reflection mode)
- Never reveal answers before the user attempts to answer

Question presentation:
- For binary (T/F): Present the statement clearly
- For multiple choice: List all options with letters (A, B, C, D)
- For Q&A: Present the question and let them respond freely

After wrong answers:
- Acknowledge their effort
- Briefly explain why the correct answer is right
- Ask if they'd like to reflect on the concept more deeply`;

/**
 * Build the complete system prompt for Quiz mode.
 */
export function buildQuizPrompt(options: QuizOptions): string {
    let contextSection = `
Quiz Session: ${options.quizSessionId}
Course: ${options.courseId}
Lesson: ${options.lessonId}`;

    if (options.questionId && options.questionText) {
        contextSection += `

Current Question (${options.questionType || "unknown type"}):
${options.questionText}`;

        if (options.ipTitle) {
            contextSection += `
Related Information Point: ${options.ipTitle}`;
        }
    }

    const constraints = `
Constraints:
- Do not reveal answers to questions the user hasn't attempted
- Stay focused on the current question until it's answered
- If the user wants to skip, acknowledge and move on
- Encourage reflection for wrong answers but don't force it`;

    return `${BASE_PROMPT}

${contextSection}

${constraints}`;
}
