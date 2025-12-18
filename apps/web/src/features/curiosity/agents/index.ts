/**
 * Curiosity Agent Module
 *
 * Exports for the Curiosity mode agent prompt and tools.
 *
 * Note: The curiosityAgent itself remains in @/lib/ai/agents/curiosity
 * because it depends on the AI SDK Agent infrastructure and tools.
 * Only the prompt building logic is co-located here for feature cohesion.
 */

export { buildCuriosityPrompt } from "./prompt";
