"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownElementProps
    extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.ReactNode;
    label: string;
    selected?: boolean;
    disabled?: boolean;
}

const DropdownElement = React.forwardRef<HTMLDivElement, DropdownElementProps>(
    ({ className, icon, label, selected, disabled, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center gap-3 w-full",
                    disabled && "opacity-50 pointer-events-none",
                    className
                )}
                aria-selected={selected}
                aria-disabled={disabled}
                {...props}
            >
                <span className="flex-shrink-0 flex items-center justify-center">
                    {icon}
                </span>
                <span className={cn("flex-1 text-sm font-medium")}>
                    {label}
                </span>
            </div>
        );
    }
);
DropdownElement.displayName = "DropdownElement";

export { DropdownElement };
