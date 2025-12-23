/**
 * CourseInfoSidebar
 *
 * Sidebar for unenrolled users showing community stats and time investment.
 */

import { HiStar, HiUsers, HiClock, HiCalendar } from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";

interface CourseInfoSidebarProps {
    memberCount: number;
    averageRating: number | null;
    ratingCount: number;
    weeksToMastery: number;
    hoursPerWeek: number;
    totalHours: number;
    courseId: string;
    isLoggedIn: boolean;
}

export function CourseInfoSidebar({
    memberCount,
    averageRating,
    ratingCount,
    weeksToMastery,
    hoursPerWeek,
    totalHours,
    courseId,
    isLoggedIn,
}: CourseInfoSidebarProps) {
    /**
     * Format hours to a readable string
     */
    const formatHours = (hours: number): string => {
        if (hours < 1) {
            return `${Math.round(hours * 60)} min`;
        }
        if (hours === Math.floor(hours)) {
            return `${hours} ${hours === 1 ? "hour" : "hours"}`;
        }
        return `${hours.toFixed(1)} hours`;
    };

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-80">
            <div className="flex flex-col gap-4">
                {/* Community Stats Card */}
                <div className="rounded-lg border border-border bg-surface-1 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-4">
                        Community
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <HiUsers className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-mono text-foreground">
                                    {memberCount}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {memberCount === 1
                                        ? "student enrolled"
                                        : "students enrolled"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                                <HiStar className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                {averageRating ? (
                                    <>
                                        <span className="text-xl font-bold font-mono text-foreground">
                                            {averageRating.toFixed(1)}
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                            {ratingCount}{" "}
                                            {ratingCount === 1
                                                ? "rating"
                                                : "ratings"}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            No ratings yet
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            Be the first to rate
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Investment Card */}
                <div className="rounded-lg border border-border bg-surface-1 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-4">
                        Time Investment
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                                <HiCalendar className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-mono text-foreground">
                                    {weeksToMastery}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {weeksToMastery === 1
                                        ? "week to mastery"
                                        : "weeks to mastery"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                                <HiClock className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-mono text-foreground">
                                    {hoursPerWeek}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    hours per week
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                        Based on {formatHours(totalHours)} total study time
                    </p>
                </div>

                {/* Enroll CTA */}
                <form action={`/api/courses/${courseId}/enroll`} method="POST">
                    <Button
                        type={isLoggedIn ? "submit" : "button"}
                        className="w-full"
                        size="lg"
                        asChild={!isLoggedIn}
                    >
                        {isLoggedIn ? (
                            "Enroll Now"
                        ) : (
                            <a href={`/login?callbackUrl=/courses/${courseId}`}>
                                Sign in to Enroll
                            </a>
                        )}
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Blog
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Store
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Efficacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Careers
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Investors
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    );
}
