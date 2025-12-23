/**
 * PracticeSession Component
 *
 * Orchestrates a learning session through multiple information points.
 * Manages state transitions between IPs and shows completion screen.
 *
 * Uses LearnChatLayout (mirrors ExploreChatLayout) for the active learning state.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FocusLayout } from "@/components/ui/layout";
import { Button } from "@/components/ui/shadcn/button";
import { HiArrowLeft, HiCheck, HiPlay, HiAcademicCap } from "react-icons/hi";
import { LearnChat } from "../LearnChat";
import { LearnChatLayout } from "../LearnChatLayout";
import { markIPAsIntroduced } from "@/app/actions/learning";
import type {
    PracticeSessionProps,
    PracticeSessionState,
} from "../../../types";

export function PracticeSession({
    courseId,
    initialIPs,
}: PracticeSessionProps) {
    const router = useRouter();

    // Session state
    const [state, setState] = useState<PracticeSessionState>(() => ({
        ips: initialIPs,
        currentIndex: 0,
        completedIds: [],
        status: initialIPs.length === 0 ? "empty" : "active",
    }));

    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentIP = state.ips[state.currentIndex];
    const totalIPs = state.ips.length;
    const completedCount = state.completedIds.length;

    /**
     * Handle IP completion - mark as introduced and move to next.
     */
    const handleIPComplete = useCallback(async () => {
        if (!currentIP || isTransitioning) return;

        setIsTransitioning(true);

        try {
            // Mark IP as introduced in database
            const result = await markIPAsIntroduced(currentIP.id);

            if ("error" in result) {
                console.error("Failed to mark IP as introduced:", result.error);
                // Continue anyway to not block user
            }

            // Update state
            setState((prev) => {
                const newCompletedIds = [...prev.completedIds, currentIP.id];
                const nextIndex = prev.currentIndex + 1;

                // Check if session is complete
                if (nextIndex >= prev.ips.length) {
                    return {
                        ...prev,
                        completedIds: newCompletedIds,
                        status: "completed",
                    };
                }

                return {
                    ...prev,
                    currentIndex: nextIndex,
                    completedIds: newCompletedIds,
                };
            });
        } finally {
            setIsTransitioning(false);
        }
    }, [currentIP, isTransitioning]);

    /**
     * Handle continuing with more IPs.
     */
    const handleContinue = () => {
        router.refresh(); // Refresh to get next batch of IPs
    };

    /**
     * Handle returning to course page.
     */
    const handleReturnToCourse = () => {
        router.push(`/courses/${courseId}`);
    };

    // Empty state - no IPs to learn
    if (state.status === "empty") {
        return (
            <FocusLayout title="Practice" backHref={`/courses/${courseId}`}>
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <HiAcademicCap className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        All caught up!
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                        You&apos;ve been introduced to all the concepts in this
                        course. Time to practice what you&apos;ve learned with
                        quizzes!
                    </p>
                    <Button onClick={handleReturnToCourse}>
                        <HiArrowLeft className="h-4 w-4 mr-2" />
                        Back to Course
                    </Button>
                </div>
            </FocusLayout>
        );
    }

    // Completion state - finished the session
    if (state.status === "completed") {
        return (
            <FocusLayout
                title="Practice Complete"
                backHref={`/courses/${courseId}`}
            >
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                        <HiCheck className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Great work!</h2>
                    <p className="text-muted-foreground max-w-md mb-2">
                        You&apos;ve learned {completedCount} new concept
                        {completedCount !== 1 ? "s" : ""}!
                    </p>
                    <div className="space-y-2 mb-8 text-left">
                        {state.ips.map((ip) => (
                            <div
                                key={ip.id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <HiCheck className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-foreground">
                                    {ip.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleReturnToCourse}
                        >
                            <HiArrowLeft className="h-4 w-4 mr-2" />
                            Back to Course
                        </Button>
                        <Button onClick={handleContinue}>
                            <HiPlay className="h-4 w-4 mr-2" />
                            Continue Learning
                        </Button>
                    </div>
                </div>
            </FocusLayout>
        );
    }

    // Active learning state - uses LearnChatLayout (mirrors ExploreChatLayout)
    return (
        <LearnChatLayout
            courseId={courseId}
            ipTitle={currentIP.title}
            currentIndex={state.currentIndex + 1}
            totalCount={totalIPs}
            onUnderstand={handleIPComplete}
            isLoading={isTransitioning}
        >
            {/* Key prop forces re-mount when IP changes, clearing chat state */}
            <LearnChat key={currentIP.id} ip={currentIP} courseId={courseId} />
        </LearnChatLayout>
    );
}
