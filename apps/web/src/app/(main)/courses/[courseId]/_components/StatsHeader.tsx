/**
 * StatsHeader
 *
 * Top section of the enrolled course view containing:
 * - Left: Practice Now button (flexible width, links to practice page)
 * - Right: Daily Study card (square) + Streak card (square)
 */

import Link from "next/link";
import { HiPlay } from "react-icons/hi";
import { DailyStudyCard } from "./DailyStudyCard";
import { StreakCard } from "./StreakCard";

interface StatsHeaderProps {
    courseId: string;
    /** Current streak in days */
    streak: number;
    /** Minutes studied today */
    minutesStudied: number;
    /** Target minutes per session from user's schedule */
    targetMinutes: number;
}

export function StatsHeader({
    courseId,
    streak,
    minutesStudied,
    targetMinutes,
}: StatsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {/* Left: Practice Now Button - takes remaining space */}
            <Link
                href={`/courses/${courseId}/practice`}
                className="flex-1 group"
            >
                <div className="relative h-full min-h-[140px] overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
                        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-white/10" />
                    </div>

                    <div className="relative flex h-full items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110">
                            <HiPlay className="h-8 w-8 text-white ml-1" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                Practice Now
                            </h3>
                            <p className="text-sm text-white/80">
                                Continue your learning journey
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Right: Daily Study + Streak cards (square) */}
            <div className="flex flex-row sm:flex-row gap-4">
                <DailyStudyCard
                    minutesStudied={minutesStudied}
                    targetMinutes={targetMinutes}
                />
                <StreakCard streak={streak} />
            </div>
        </div>
    );
}
