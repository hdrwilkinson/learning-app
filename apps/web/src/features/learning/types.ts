/**
 * Learning Feature Types
 *
 * Types for the practice/learn mode feature.
 */

import type { LearnableIP } from "@/app/actions/learning";

/**
 * Practice session state - tracks progress through multiple IPs.
 */
export interface PracticeSessionState {
    /** All IPs to learn in this session */
    ips: LearnableIP[];
    /** Current IP index (0-based) */
    currentIndex: number;
    /** IPs that have been completed in this session */
    completedIds: string[];
    /** Session status */
    status: "active" | "completed" | "empty";
}

/**
 * Props for the PracticeSession component.
 */
export interface PracticeSessionProps {
    /** Course ID for the session */
    courseId: string;
    /** Initial IPs to learn (pre-fetched by server) */
    initialIPs: LearnableIP[];
}

/**
 * Props for the LearnChat component.
 * Note: "I understand" button is in LearnChatLayout (like ExploreChatLayout pattern).
 */
export interface LearnChatProps {
    /** The information point being learned */
    ip: LearnableIP;
    /** Course ID for API calls */
    courseId: string;
    /** Additional class name */
    className?: string;
}

// Re-export LearnableIP for convenience
export type { LearnableIP };
