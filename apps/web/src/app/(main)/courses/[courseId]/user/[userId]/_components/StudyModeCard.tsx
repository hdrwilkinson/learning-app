/**
 * StudyModeCard
 *
 * Individual card for a secondary study mode.
 */

import Link from "next/link";
import type { IconType } from "react-icons";

interface StudyModeCardProps {
    href: string;
    icon: IconType;
    title: string;
    description: string;
    iconColor: string;
    iconBgColor: string;
}

export function StudyModeCard({
    href,
    icon: Icon,
    title,
    description,
    iconColor,
    iconBgColor,
}: StudyModeCardProps) {
    return (
        <Link href={href} className="block group">
            <div className="h-full rounded-lg border border-border bg-surface-1 p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:bg-surface-2">
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBgColor}`}
                    >
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
