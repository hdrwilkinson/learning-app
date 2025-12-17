/**
 * AI Tools Index
 *
 * Exports all available tools for use by chat agents.
 * Tools are shared across agents - each agent selects which tools it needs.
 */

export { explainConcept } from "./explain-concept";
export { markUnderstood } from "./mark-understood";
export { checkUnderstanding } from "./check-understanding";
export { submitAnswer } from "./submit-answer";
export { saveDiscovery } from "./save-discovery";

/**
 * Tool collections for convenience.
 * Agents can import these pre-bundled sets or pick individual tools.
 */
import { explainConcept } from "./explain-concept";
import { markUnderstood } from "./mark-understood";
import { checkUnderstanding } from "./check-understanding";
import { submitAnswer } from "./submit-answer";
import { saveDiscovery } from "./save-discovery";

/** Tools available in Learn mode */
export const learnTools = {
    explainConcept,
    markUnderstood,
    checkUnderstanding,
};

/** Tools available in Quiz mode */
export const quizTools = {
    submitAnswer,
    explainConcept,
};

/** Tools available in Curiosity mode */
export const curiosityTools = {
    explainConcept,
    saveDiscovery,
};

/** Tools available in Reflection mode */
export const reflectionTools = {
    explainConcept,
};

/** All tools (for reference/testing) */
export const allTools = {
    explainConcept,
    markUnderstood,
    checkUnderstanding,
    submitAnswer,
    saveDiscovery,
};
