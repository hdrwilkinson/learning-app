/**
 * CourseCard Component
 *
 * Displays a course summary card with image and overlay text.
 * Minimal view shows title, rating, and enrolled count at bottom of image.
 * Expanded view (on hover/focus) expands overlay upward to reveal description and time estimates.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { HiStar, HiUsers, HiCalendar, HiClock } from "react-icons/hi";
import { cn } from "@/lib/utils";
import type { CourseListItem } from "../../../types";

interface CourseCardProps {
    course: CourseListItem;
}

/**
 * Info item with optional tooltip
 */
function InfoItem({
    icon,
    value,
    tooltip,
    className,
}: {
    icon: React.ReactNode;
    value: string;
    tooltip?: string;
    className?: string;
}) {
    return (
        <div className={cn("relative group/info", className)}>
            <div className="flex items-center gap-1 cursor-default">
                {icon}
                <span className="text-sm">{value}</span>
            </div>
            {tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-150 z-[200] pointer-events-none">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
}

/**
 * Calculate time estimates for a course
 */
function calculateTimeEstimates(
    totalIPs: number,
    minutesPerIP: number,
    hoursPerWeek: number = 5
) {
    if (totalIPs === 0) {
        return { weeksToMastery: 0, hoursPerWeek };
    }

    const totalMinutes = totalIPs * minutesPerIP;
    const totalHours = totalMinutes / 60;
    const weeks = totalHours / hoursPerWeek;

    return {
        weeksToMastery: Math.ceil(weeks),
        hoursPerWeek,
    };
}

/**
 * Gradient placeholder for courses without images
 */
function ImagePlaceholder({ topic }: { topic: string | null }) {
    // Generate a consistent gradient based on topic
    const gradients = [
        "from-primary/80 to-secondary/80",
        "from-secondary/80 to-accent/80",
        "from-accent/80 to-primary/80",
        "from-primary/70 via-accent/60 to-secondary/70",
    ];

    const index = topic
        ? topic.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
          gradients.length
        : 0;

    return (
        <div
            className={cn(
                "absolute inset-0 bg-gradient-to-br",
                gradients[index]
            )}
        >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>
    );
}

export function CourseCard({ course }: CourseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const timeEstimates = calculateTimeEstimates(
        course.totalInformationPoints,
        course.estimatedMinutesPerIP
    );

    const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
    const handleMouseLeave = useCallback(() => setIsExpanded(false), []);
    const handleFocus = useCallback(() => setIsExpanded(true), []);
    const handleBlur = useCallback(() => setIsExpanded(false), []);

    return (
        <Link
            href={`/courses/${course.id}`}
            className="block group/card outline-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <Card
                className={cn(
                    "relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    "hover:shadow-xl hover:border-primary/30",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                    "aspect-[4/3]"
                )}
            >
                {/* Full-bleed image */}
                {course.imageUrl ? (
                    <Image
                        src={course.imageUrl}
                        alt={`Cover image for ${course.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                        unoptimized={course.imageUrl.startsWith("/images/")}
                    />
                ) : (
                    <ImagePlaceholder topic={course.topic} />
                )}

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Topic badge - positioned top right */}
                {course.topic && (
                    <Badge
                        variant="secondary"
                        className={cn(
                            "absolute top-3 right-3 bg-white/90 text-foreground backdrop-blur-sm",
                            "shadow-sm border-0 z-10"
                        )}
                    >
                        {course.topic}
                    </Badge>
                )}

                {/* Bottom overlay content - white card panel */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 p-3",
                        "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    )}
                >
                    {/* Content container with white background */}
                    <div className="relative bg-white rounded-xl p-4 shadow-lg">
                        {/* Stats row - always visible */}
                        <div className="flex items-center gap-3 text-muted-foreground mb-2">
                            <InfoItem
                                icon={
                                    <HiStar className="h-4 w-4 text-amber-500 fill-amber-500" />
                                }
                                value={
                                    course.averageRating
                                        ? course.averageRating.toFixed(1)
                                        : "—"
                                }
                                tooltip={
                                    course.averageRating
                                        ? `${course.averageRating.toFixed(1)} average rating from ${course.ratingCount} ${course.ratingCount === 1 ? "review" : "reviews"}`
                                        : "No ratings yet"
                                }
                            />
                            <InfoItem
                                icon={<HiUsers className="h-4 w-4" />}
                                value={String(course.memberCount)}
                                tooltip={`${course.memberCount} ${course.memberCount === 1 ? "student" : "students"} enrolled`}
                            />
                        </div>

                        {/* Title - always visible */}
                        <h3
                            className={cn(
                                "font-display font-semibold text-lg leading-tight text-foreground",
                                "transition-all duration-200",
                                isExpanded ? "line-clamp-2" : "line-clamp-1"
                            )}
                        >
                            {course.title}
                        </h3>

                        {/* Expandable content - slides up on hover */}
                        <div
                            className={cn(
                                "grid transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
                                isExpanded
                                    ? "grid-rows-[1fr] opacity-100 mt-3"
                                    : "grid-rows-[0fr] opacity-0 mt-0"
                            )}
                        >
                            <div className="overflow-hidden">
                                {/* Description */}
                                {course.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {course.description}
                                    </p>
                                )}

                                {/* Time estimates */}
                                <div className="flex items-center gap-4 text-muted-foreground pt-2">
                                    <InfoItem
                                        icon={
                                            <HiCalendar className="h-4 w-4" />
                                        }
                                        value={`${timeEstimates.weeksToMastery} ${timeEstimates.weeksToMastery === 1 ? "wk" : "wks"}`}
                                        tooltip={`Estimated ${timeEstimates.weeksToMastery} ${timeEstimates.weeksToMastery === 1 ? "week" : "weeks"} to complete`}
                                    />
                                    <InfoItem
                                        icon={<HiClock className="h-4 w-4" />}
                                        value={`${timeEstimates.hoursPerWeek} hrs/wk`}
                                        tooltip={`Based on ${timeEstimates.hoursPerWeek} hours of study per week`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
