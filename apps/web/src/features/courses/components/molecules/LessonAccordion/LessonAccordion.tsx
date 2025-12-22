/**
 * LessonAccordion Component
 *
 * Displays a lesson with its information points in an accordion.
 * Shows lesson title, description, and a list of IPs when expanded.
 */

"use client";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/shadcn/accordion";
import { Badge } from "@/components/ui/shadcn/badge";
import type { LessonData } from "../../../types";

interface LessonAccordionProps {
    lesson: LessonData;
    moduleOrder: number;
}

function getTypeBadgeVariant(
    type: string | null
): "default" | "secondary" | "outline" {
    switch (type) {
        case "definition":
            return "default";
        case "concept":
            return "secondary";
        case "procedure":
            return "outline";
        case "example":
            return "secondary";
        default:
            return "outline";
    }
}

export function LessonAccordion({ lesson, moduleOrder }: LessonAccordionProps) {
    return (
        <AccordionItem
            value={`lesson-${lesson.id}`}
            className="border-l-2 border-muted pl-4 ml-4"
        >
            <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 text-left">
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                        {moduleOrder}.{lesson.order}
                    </span>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.description && (
                            <span className="text-sm text-muted-foreground line-clamp-1">
                                {lesson.description}
                            </span>
                        )}
                    </div>
                    <Badge variant="outline" className="ml-auto shrink-0">
                        {lesson.informationPoints.length} IPs
                    </Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-3 pt-2">
                    {lesson.informationPoints.map((ip) => (
                        <div
                            key={ip.id}
                            className="p-3 rounded-md bg-muted/50 border border-muted"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-medium text-sm">
                                    {ip.title}
                                </h4>
                                {ip.type && (
                                    <Badge
                                        variant={getTypeBadgeVariant(ip.type)}
                                        className="text-xs shrink-0"
                                    >
                                        {ip.type}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {ip.content}
                            </p>
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
