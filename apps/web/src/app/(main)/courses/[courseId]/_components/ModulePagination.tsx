/**
 * ModulePagination
 *
 * Navigation controls for switching between modules.
 */

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";

interface ModulePaginationProps {
    currentIndex: number;
    totalModules: number;
    moduleTitle: string;
    onPrev: () => void;
    onNext: () => void;
}

export function ModulePagination({
    currentIndex,
    totalModules,
    moduleTitle,
    onPrev,
    onNext,
}: ModulePaginationProps) {
    const isFirstModule = currentIndex === 0;
    const isLastModule = currentIndex === totalModules - 1;

    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 p-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={isFirstModule}
                className="gap-1"
            >
                <HiChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
            </Button>

            <div className="text-center min-w-0 px-2">
                <h3 className="font-semibold text-foreground truncate">
                    {moduleTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                    Module {currentIndex + 1} of {totalModules}
                </p>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={isLastModule}
                className="gap-1"
            >
                <span className="hidden sm:inline">Next</span>
                <HiChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
