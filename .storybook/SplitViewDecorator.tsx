import type { Decorator } from "@storybook/react";
import React from "react";

export const SplitViewDecorator: Decorator = (StoryFn, context) => {
    // Detect if we're in Docs mode vs Canvas mode
    const isDocs = context.viewMode === "docs";

    // Use viewport units for Canvas (full screen), container units for Docs
    const containerClasses = isDocs
        ? "flex flex-col md:flex-row w-full min-h-[400px]"
        : "flex flex-col md:flex-row w-screen min-h-screen";

    return (
        <div className={containerClasses}>
            {/* Light Theme Pane */}
            <div className="flex-1 relative flex items-center justify-center p-8 bg-white text-slate-950 border-b md:border-b-0 md:border-r border-neutral-200">
                <div className="absolute top-4 left-4 px-2 py-1 rounded bg-neutral-100 text-xs font-mono text-neutral-500 border border-neutral-200 z-10 select-none">
                    Light
                </div>
                {/* Explicitly defining light variables for isolation */}
                <div
                    className="light w-full h-full flex items-center justify-center"
                    style={
                        {
                            "--background": "0 0% 100%",
                            "--foreground": "222 47% 11%",
                            "--card": "0 0% 100%",
                            "--card-foreground": "222 47% 11%",
                            "--primary": "262 83% 58%",
                            "--primary-foreground": "0 0% 100%",
                            "--muted": "210 40% 96%",
                            "--muted-foreground": "215 16% 47%",
                            "--border": "214 32% 91%",
                            "--input": "214 32% 91%",
                        } as React.CSSProperties
                    }
                >
                    {StoryFn(context)}
                </div>
            </div>

            {/* Dark Theme Pane */}
            <div className="flex-1 relative flex items-center justify-center p-8 bg-slate-950 text-slate-50 dark">
                <div className="absolute top-4 left-4 px-2 py-1 rounded bg-neutral-800 text-xs font-mono text-neutral-400 border border-neutral-700 z-10 select-none">
                    Dark
                </div>
                <div
                    className="dark w-full h-full flex items-center justify-center"
                    style={
                        {
                            "--background": "222 47% 7%",
                            "--foreground": "0 0% 98%",
                            "--card": "222 47% 9%",
                            "--card-foreground": "0 0% 98%",
                            "--primary": "262 83% 65%",
                            "--primary-foreground": "0 0% 100%",
                            "--muted": "223 10% 20%",
                            "--muted-foreground": "215 20% 70%",
                            "--border": "223 10% 20%",
                            "--input": "223 10% 20%",
                        } as React.CSSProperties
                    }
                >
                    {StoryFn(context)}
                </div>
            </div>
        </div>
    );
};
