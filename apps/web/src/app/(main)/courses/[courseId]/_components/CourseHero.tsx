import Image from "next/image";
import { Badge } from "@/components/ui/shadcn/badge";

interface CourseHeroProps {
    title: string;
    topic?: string | null;
    imageUrl?: string | null;
}

/**
 * Course hero banner that displays the course image with title overlay.
 * Spans full width of the content area (~1056px) with medium height (~200px).
 */
export function CourseHero({ title, topic, imageUrl }: CourseHeroProps) {
    return (
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-muted">
            {/* Course image */}
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 1056px"
                    className="object-cover"
                    priority
                    unoptimized={imageUrl.startsWith("/images/")}
                />
            ) : (
                // Gradient fallback when no image
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
            )}

            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Title box - positioned at bottom-left */}
            <div className="absolute bottom-4 left-4 max-w-[70%]">
                <div className="bg-white dark:bg-card rounded-lg px-4 py-3 shadow-lg">
                    {topic && (
                        <Badge
                            variant="outline"
                            className="text-xs mb-1.5 bg-white/80 dark:bg-card/80"
                        >
                            {topic}
                        </Badge>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
}
