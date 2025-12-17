/**
 * Agent Registry
 *
 * Central registry for all chat agents. Provides type-safe agent selection
 * and exports all agent types for use throughout the application.
 */

import {
    learnAgent,
    type LearnAgentUIMessage,
    type LearnOptions,
} from "./learn";
import { quizAgent, type QuizAgentUIMessage, type QuizOptions } from "./quiz";
import {
    curiosityAgent,
    type CuriosityAgentUIMessage,
    type CuriosityOptions,
} from "./curiosity";
import {
    reflectionAgent,
    type ReflectionAgentUIMessage,
    type ReflectionOptions,
} from "./reflection";
import type { ChatMode, AgentOptionsMap } from "./types";

// =============================================================================
// Agent Registry
// =============================================================================

/**
 * Registry of all available chat agents.
 */
export const agents = {
    learn: learnAgent,
    quiz: quizAgent,
    curiosity: curiosityAgent,
    reflection: reflectionAgent,
} as const;

/**
 * Get an agent by mode.
 *
 * @param mode - The chat mode to get the agent for
 * @returns The corresponding agent instance
 */
export function getAgent<M extends ChatMode>(mode: M) {
    return agents[mode];
}

// =============================================================================
// Type Exports
// =============================================================================

// Re-export types for external use
export type { ChatMode, AgentOptionsMap };
export type { LearnOptions, QuizOptions, CuriosityOptions, ReflectionOptions };
export type {
    LearnAgentUIMessage,
    QuizAgentUIMessage,
    CuriosityAgentUIMessage,
    ReflectionAgentUIMessage,
};

/**
 * Union of all agent UIMessage types.
 */
export type AgentUIMessage =
    | LearnAgentUIMessage
    | QuizAgentUIMessage
    | CuriosityAgentUIMessage
    | ReflectionAgentUIMessage;

// Re-export individual agents for direct imports
export { learnAgent } from "./learn";
export { quizAgent } from "./quiz";
export { curiosityAgent } from "./curiosity";
export { reflectionAgent } from "./reflection";

// Re-export schemas for validation
export {
    learnOptionsSchema,
    quizOptionsSchema,
    curiosityOptionsSchema,
    reflectionOptionsSchema,
} from "./types";
