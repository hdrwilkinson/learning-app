import type { Decorator } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "next-themes";
import { SplitViewDecorator } from "./SplitViewDecorator";

export const useThemeProviderDecorator: Decorator = (Story, context) => {
    const theme = context.globals.theme || "light";
    const isDocs = context.viewMode === "docs";

    // Use viewport units for Canvas, container units for Docs
    const heightClass = isDocs ? "min-h-[400px]" : "min-h-screen";

    // In Docs mode, we can default to split view to show both variants
    // or just respect the toolbar. Let's default to split for better docs.
    if (isDocs && theme !== "dark" && theme !== "light") {
        return SplitViewDecorator(Story, context);
    }

    if (theme === "split") {
        return SplitViewDecorator(Story, context);
    }

    // Map storybook theme to next-themes value

    if (theme === "dark") {
        return (
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                forcedTheme="dark"
            >
                <div
                    className={`dark bg-background text-foreground ${heightClass} w-full flex items-center justify-center p-8`}
                >
                    {Story(context)}
                </div>
            </ThemeProvider>
        );
    }

    // Light theme (default)
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
        >
            <div
                className={`bg-background text-foreground ${heightClass} w-full flex items-center justify-center p-8`}
            >
                {Story(context)}
            </div>
        </ThemeProvider>
    );
};
