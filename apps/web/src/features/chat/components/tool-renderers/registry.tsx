/**
 * Tool Registry
 *
 * Maps tool names to their React renderers for custom UI in chat messages.
 * Tools not in the registry fall back to the generic ToolInvocation display.
 */

import type { ToolRenderer } from "../../types";
import { FollowUpQuestions } from "./FollowUpQuestions";

/**
 * Registry mapping tool names to their renderer components.
 * Add new tools here as they are created.
 */
export const toolRegistry: Record<string, ToolRenderer> = {
    suggestFollowUpQuestions: FollowUpQuestions as ToolRenderer,
};

/**
 * Check if a tool has a custom renderer.
 */
export function hasCustomRenderer(toolName: string): boolean {
    return toolName in toolRegistry;
}

/**
 * Get the renderer for a tool, or undefined if none exists.
 */
export function getToolRenderer(toolName: string): ToolRenderer | undefined {
    return toolRegistry[toolName];
}

/**
 * Register a custom tool renderer.
 * Useful for features that need to add their own tool renderers.
 */
export function registerToolRenderer(
    toolName: string,
    renderer: ToolRenderer
): void {
    toolRegistry[toolName] = renderer;
}
