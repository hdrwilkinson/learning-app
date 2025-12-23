/**
 * DailyStudyCard
 *
 * Square card showing daily study time progress with a circular indicator.
 * Displays minutes studied vs target minutes.
 */

"use client";

interface DailyStudyCardProps {
    /** Minutes studied today */
    minutesStudied: number;
    /** Target minutes per session from user's schedule */
    targetMinutes: number;
}

export function DailyStudyCard({
    minutesStudied,
    targetMinutes,
}: DailyStudyCardProps) {
    // Calculate progress percentage (cap at 100%)
    const progress = Math.min((minutesStudied / targetMinutes) * 100, 100);

    // SVG circle parameters - smaller for square card
    const size = 72;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex aspect-square w-[140px] flex-col items-center justify-center rounded-xl border border-border bg-card p-4">
            {/* SVG Circular Progress */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>

                {/* Center content - x/y */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold text-foreground">
                        {minutesStudied}/{targetMinutes}
                    </span>
                </div>
            </div>

            {/* Label */}
            <span className="mt-2 text-center text-xs font-medium text-muted-foreground leading-tight">
                Daily Study
                <br />
                Minutes
            </span>
        </div>
    );
}
