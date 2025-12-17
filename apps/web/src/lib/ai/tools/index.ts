/**
 * AI Tools Index
 *
 * Exports all available tools for use by chat agents.
 * Tools are shared across agents - each agent selects which tools it needs.
 */

export { suggestFollowUpQuestions } from "./suggest-follow-up-questions";

/**
 * Tool collections for convenience.
 * Agents can import these pre-bundled sets or pick individual tools.
 */
import { suggestFollowUpQuestions } from "./suggest-follow-up-questions";

/** Tools available in Learn mode */
export const learnTools = {};

/** Tools available in Quiz mode */
export const quizTools = {};

/** Tools available in Curiosity mode */
export const curiosityTools = {
    suggestFollowUpQuestions,
};

/** Tools available in Reflection mode */
export const reflectionTools = {};

/** All tools (for reference/testing) */
export const allTools = {
    suggestFollowUpQuestions,
};
