/**
 * StreakCard
 *
 * Square card showing the user's current learning streak.
 * Displays a fire icon with the streak count in days.
 */

import { HiFire } from "react-icons/hi";

interface StreakCardProps {
    /** Current streak in days */
    streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
    return (
        <div className="flex aspect-square w-[140px] flex-col items-center justify-center rounded-xl border border-border bg-card p-4">
            {/* Streak icon and number */}
            <div className="flex items-center gap-1">
                <HiFire className="h-10 w-10 text-accent-gold" />
                <span className="font-display-fun text-5xl font-bold text-foreground">
                    {streak}
                </span>
            </div>

            {/* Label */}
            <span className="mt-2 text-xs font-medium text-muted-foreground">
                day streak
            </span>
        </div>
    );
}
