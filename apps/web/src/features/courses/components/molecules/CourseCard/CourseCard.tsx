/**
 * CourseCard Component
 *
 * Displays a course summary card for the courses listing page.
 * Shows title, description, topic badge, rating, members, and time estimates.
 */

import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { HiStar, HiUsers, HiCalendar, HiClock } from "react-icons/hi";
import type { CourseListItem } from "../../../types";

interface CourseCardProps {
    course: CourseListItem;
}

/**
 * Info item with hover tooltip (uses Radix portal for proper z-index)
 */
function InfoItem({
    icon,
    value,
    tooltip,
}: {
    icon: React.ReactNode;
    value: string;
    tooltip: string;
}) {
    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-default">
                    {icon}
                    <span>{value}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                className="bg-gray-900 text-white border-gray-900"
            >
                {tooltip}
            </TooltipContent>
        </Tooltip>
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

export function CourseCard({ course }: CourseCardProps) {
    const timeEstimates = calculateTimeEstimates(
        course.totalInformationPoints,
        course.estimatedMinutesPerIP
    );

    return (
        <Link href={`/courses/${course.id}`} className="block group/card">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-focus-visible/card:ring-2 group-focus-visible/card:ring-primary">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-display line-clamp-2 group-hover/card:text-primary transition-colors">
                            {course.title}
                        </CardTitle>
                        {course.topic && (
                            <Badge variant="secondary" className="shrink-0">
                                {course.topic}
                            </Badge>
                        )}
                    </div>
                    {course.description && (
                        <CardDescription className="line-clamp-3 mt-2">
                            {course.description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {/* Placeholder for future course image */}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-between w-full">
                        {/* Left: Rating & Members */}
                        <div className="flex items-center gap-3">
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

                        {/* Right: Time estimates */}
                        <div className="flex items-center gap-3">
                            <InfoItem
                                icon={<HiCalendar className="h-4 w-4" />}
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
                </CardFooter>
            </Card>
        </Link>
    );
}
