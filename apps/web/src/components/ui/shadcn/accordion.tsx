"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { HiChevronDown } from "react-icons/hi";

import { cn } from "@/lib/utils";

// Note: Using 'any' casts to work around React 19 type compatibility issues with Radix UI
// These components work correctly at runtime

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Accordion = AccordionPrimitive.Root as any;

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, ...props }, ref) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Item = AccordionPrimitive.Item as any;
        return (
            <Item ref={ref} className={cn("border-b", className)} {...props} />
        );
    }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Header = AccordionPrimitive.Header as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Trigger = AccordionPrimitive.Trigger as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ChevronIcon = HiChevronDown as any;

    return (
        <Header className="flex">
            <Trigger
                ref={ref}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </Trigger>
        </Header>
    );
});
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
    forceMount?: boolean;
    asChild?: boolean;
}

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    AccordionContentProps
>(({ className, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Content = AccordionPrimitive.Content as any;

    return (
        <Content
            ref={ref}
            className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
            {...props}
        >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </Content>
    );
});

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
