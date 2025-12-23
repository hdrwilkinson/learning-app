/**
 * ReviewCard Component
 *
 * Displays a course review with rating, comment, and reviewer's progress metrics.
 * Used in both the course page preview and the full reviews page.
 */

import { HiStar, HiBookOpen, HiAcademicCap } from "react-icons/hi";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
    id: string;
    rating: number;
    review: string | null;
    completionPercent: number;
    masteryPercent: number;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
    /** Whether to show truncated text (for preview mode) */
    truncate?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Render star rating display
 */
function StarRating({ rating }: { rating: number }) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <HiStar
                    key={i}
                    className={cn(
                        "h-4 w-4",
                        i < rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
}

/**
 * Get initials from a name for avatar fallback
 */
function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Format date to a readable string
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function ReviewCard({
    rating,
    review,
    completionPercent,
    masteryPercent,
    createdAt,
    user,
    truncate = false,
    className,
}: ReviewCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-4 sm:p-5">
                {/* Header: User info and rating */}
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                            src={user.image ?? undefined}
                            alt={user.name ?? "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm truncate">
                                {user.name ?? "Anonymous"}
                            </span>
                            <StarRating rating={rating} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <time dateTime={createdAt}>
                                {formatDate(createdAt)}
                            </time>
                        </div>
                    </div>
                </div>

                {/* Review text */}
                {review && (
                    <p
                        className={cn(
                            "text-sm text-muted-foreground leading-relaxed mb-3",
                            truncate && "line-clamp-3"
                        )}
                    >
                        {review}
                    </p>
                )}
                {!review && (
                    <p className="text-sm text-muted-foreground/60 italic mb-3">
                        No written review
                    </p>
                )}

                {/* Progress badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="secondary"
                        className="text-xs font-normal gap-1"
                    >
                        <HiBookOpen className="h-3 w-3" />
                        {completionPercent}% completed
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="text-xs font-normal gap-1"
                    >
                        <HiAcademicCap className="h-3 w-3" />
                        {masteryPercent}% mastery
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
