/**
 * Curiosity Mode System Prompt
 *
 * Builds the system prompt for Curiosity mode based on context.
 * Extends the shared base prompt with curiosity-specific behavior.
 *
 * @see docs/features/specifications/learning-interaction-modes.md
 */

import type { CuriosityOptions } from "../types";
import { getBasePrompt } from "../base-prompt";

/**
 * Curiosity mode specific prompt - role and guidelines for free exploration.
 */
const MODE_PROMPT = `Current Mode: CURIOSITY

You are a knowledgeable companion helping the user explore topics freely.
Curiosity mode is about following interests wherever they lead.

Guidelines:
- Follow the user's curiosity wherever it leads
- Make connections between topics when relevant
- Suggest related areas they might find interesting
- Be enthusiastic about learning together

Communication style:
- Conversational and natural
- Be curious and engaged yourself

IMPORTANT - TOOL USAGE:
You have access to the suggestFollowUpQuestions tool. You MUST call this tool at the END of EVERY response.
Do NOT describe the tool or talk about it - actually INVOKE it by calling it with 2-3 relevant follow-up questions.
The questions should be interesting, related to what was just discussed, and encourage deeper exploration.`;

/**
 * Build the complete system prompt for Curiosity mode.
 */
export function buildCuriosityPrompt(options: CuriosityOptions): string {
    const isInCourse = !!options.courseId;

    let contextSection: string;

    if (isInCourse) {
        contextSection = `
Mode: In-Course Curiosity
Course: ${options.courseTitle || options.courseId}${options.courseDescription ? `\nDescription: ${options.courseDescription}` : ""}
Progress: ${options.progress !== undefined ? `${options.progress}%` : "Unknown"}
${options.completedTopics?.length ? `Topics covered: ${options.completedTopics.join(", ")}` : ""}

You can help the user explore topics related to this course.`;
    } else {
        contextSection = `
Mode: General Curiosity
No course context - the user is freely exploring any topic of interest.`;
    }

    const constraints = isInCourse
        ? `
Context: While free to explore, you can reference how topics connect to the course content when relevant.`
        : `
Context: No constraints - follow curiosity freely.`;

    return `${getBasePrompt()}

${MODE_PROMPT}

${contextSection}

${constraints}`;
}
