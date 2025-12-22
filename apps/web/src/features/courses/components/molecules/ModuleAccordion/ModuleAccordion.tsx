/**
 * ModuleAccordion Component
 *
 * Displays a module with nested lesson accordions.
 * Shows module title, description, and lessons when expanded.
 */

"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/shadcn/accordion";
import { Badge } from "@/components/ui/shadcn/badge";
import { LessonAccordion } from "../LessonAccordion";
import type { ModuleData } from "../../../types";

interface ModuleAccordionProps {
    module: ModuleData;
    defaultOpen?: boolean;
}

export function ModuleAccordion({
    module,
    defaultOpen = false,
}: ModuleAccordionProps) {
    const totalIPs = module.lessons.reduce(
        (sum, lesson) => sum + lesson.informationPoints.length,
        0
    );

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
                    <div className="flex gap-2 shrink-0">
                        <Badge variant="secondary">
                            {module.lessons.length}{" "}
                            {module.lessons.length === 1 ? "lesson" : "lessons"}
                        </Badge>
                        <Badge variant="outline">{totalIPs} IPs</Badge>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="pb-4">
                    <Accordion
                        type="multiple"
                        defaultValue={
                            defaultOpen
                                ? [`lesson-${module.lessons[0]?.id}`]
                                : []
                        }
                    >
                        {module.lessons.map((lesson) => (
                            <LessonAccordion
                                key={lesson.id}
                                lesson={lesson}
                                moduleOrder={module.order}
                            />
                        ))}
                    </Accordion>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
