/**
 * CourseCard Component
 *
 * Displays a course summary card for the courses listing page.
 * Shows title, description, topic badge, and module/lesson counts.
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
import type { CourseListItem } from "../../../types";

interface CourseCardProps {
    course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course.id}`} className="block group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-display line-clamp-2 group-hover:text-primary transition-colors">
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
                    <div className="flex gap-4">
                        <span>
                            {course.moduleCount}{" "}
                            {course.moduleCount === 1 ? "module" : "modules"}
                        </span>
                        <span>•</span>
                        <span>
                            {course.lessonCount}{" "}
                            {course.lessonCount === 1 ? "lesson" : "lessons"}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
