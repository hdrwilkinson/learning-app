"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, type NavigationItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="w-full h-16 border-t border-border bg-surface-1 flex items-center px-4 safe-area-inset-bottom">
            {/* Logo placeholder - bottom left */}
            <div className="flex items-center justify-center w-12 h-12 shrink-0">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground text-xs font-display font-bold">
                        C
                    </span>
                </div>
            </div>

            {/* Navigation Items - Icons only */}
            <div className="flex-1 flex items-center justify-around gap-2">
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
                                "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200",
                                "text-foreground hover:bg-surface-2",
                                isActive && "bg-accent/10 text-accent shadow-sm"
                            )}
                            aria-label={item.label}
                        >
                            <Icon
                                className={cn(
                                    "h-6 w-6 shrink-0",
                                    isActive ? "text-accent" : "text-foreground"
                                )}
                            />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
