"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    NAVIGATION_ITEMS,
    APP_TITLE,
    type NavigationItem,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChatHistory } from "./ChatHistory";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-16 lg:w-64 border-r border-border bg-surface-1 flex flex-col z-30 transition-all duration-200">
            {/* Title */}
            <div className="h-20 px-4 lg:px-8 flex items-center justify-center lg:justify-start">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-xl lg:text-3xl font-display-fun font-bold text-primary">
                        <span className="hidden lg:inline">{APP_TITLE}</span>
                        <span className="lg:hidden">C</span>
                    </h1>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="px-2 lg:px-4 py-4 space-y-1">
                {NAVIGATION_ITEMS.map((item: NavigationItem) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-200",
                                "text-foreground hover:bg-surface-2 hover:text-foreground",
                                isActive &&
                                    "bg-accent/10 text-accent border border-accent/20 shadow-sm"
                            )}
                            aria-label={item.label}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 shrink-0 flex-shrink-0",
                                    isActive ? "text-accent" : "text-foreground"
                                )}
                            />
                            <span
                                className={cn(
                                    "font-medium uppercase tracking-[0.05em] text-sm hidden lg:inline",
                                    isActive && "text-accent"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Chat History - Desktop expanded only */}
            <div className="hidden lg:block flex-1 overflow-hidden">
                <ChatHistory isExpanded={true} />
            </div>

            {/* Chat History - Tablet collapsed */}
            <div className="hidden md:block lg:hidden">
                <ChatHistory isExpanded={false} />
            </div>
        </aside>
    );
}
