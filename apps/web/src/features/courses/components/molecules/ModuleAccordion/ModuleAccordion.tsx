/**
 * ModuleAccordion Component
 *
 * Displays a module with nested lesson items.
 * Shows module title, description, and lessons when expanded.
 */

"use client";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/shadcn/accordion";
import { Badge } from "@/components/ui/shadcn/badge";
import { LessonItem } from "../LessonItem";
import type { ModuleData } from "../../../types";

interface ModuleAccordionProps {
    module: ModuleData;
}

export function ModuleAccordion({ module }: ModuleAccordionProps) {
    return (
        <AccordionItem
            value={`module-${module.id}`}
            className="border rounded-lg px-4"
        >
            <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left w-full">
                    <span className="text-lg font-mono font-bold text-primary shrink-0">
                        {module.order}
                    </span>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-lg font-display font-semibold">
                            {module.title}
                        </span>
                        {module.description && (
                            <span className="text-sm text-muted-foreground line-clamp-1">
                                {module.description}
                            </span>
                        )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                        {module.lessons.length}{" "}
                        {module.lessons.length === 1 ? "lesson" : "lessons"}
                    </Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="pb-4 space-y-2">
                    {module.lessons.map((lesson) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            moduleOrder={module.order}
                        />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
