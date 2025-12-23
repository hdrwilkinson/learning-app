/**
 * ProgressStats
 *
 * Your Progress card showing completion, mastery, and time stats for enrolled users.
 */

import { HiChartBar, HiAcademicCap, HiClock, HiCalendar } from "react-icons/hi";

export interface CourseProgress {
    completionPercent: number;
    masteryPercent: number;
    totalTimeStudiedMinutes: number;
    memberSince: Date;
}

interface ProgressStatsProps {
    progress: CourseProgress;
}

export function ProgressStats({ progress }: ProgressStatsProps) {
    /**
     * Format minutes to readable duration
     */
    const formatDuration = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = minutes / 60;
        if (hours < 1) {
            return `${Math.round(minutes)} min`;
        }
        return `${hours.toFixed(1)} hrs`;
    };

    /**
     * Format relative time since joining
     */
    const formatMemberDuration = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            return "Today";
        }
        if (diffDays === 1) {
            return "1 day";
        }
        if (diffDays < 7) {
            return `${diffDays} days`;
        }
        const weeks = Math.floor(diffDays / 7);
        if (weeks === 1) {
            return "1 week";
        }
        if (weeks < 4) {
            return `${weeks} weeks`;
        }
        const months = Math.floor(diffDays / 30);
        if (months === 1) {
            return "1 month";
        }
        return `${months} months`;
    };

    return (
        <div className="rounded-lg border border-border bg-surface-1 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-4">
                Your Progress
            </h3>
            <div className="space-y-4">
                {/* Completion */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HiChartBar className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-foreground">
                                Complete
                            </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-foreground">
                            {progress.completionPercent}%
                        </span>
                    </div>
                    <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{
                                width: `${progress.completionPercent}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Mastery */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HiAcademicCap className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm text-foreground">
                                Mastered
                            </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-foreground">
                            {progress.masteryPercent}%
                        </span>
                    </div>
                    <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress.masteryPercent}%` }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Time studied */}
                        <div className="flex items-center gap-2">
                            <HiClock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {formatDuration(
                                        progress.totalTimeStudiedMinutes
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    studied
                                </p>
                            </div>
                        </div>

                        {/* Member since */}
                        <div className="flex items-center gap-2">
                            <HiCalendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {formatMemberDuration(progress.memberSince)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    member
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
